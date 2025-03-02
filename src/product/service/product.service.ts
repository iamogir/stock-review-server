import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async addNewProduct(product: ProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel({
        ...product,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      });
      return await newProduct.save();
    } catch (error) {
      throw new Error('New product was not added: ' + (error as Error).message);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const productsArr: Product[] = await this.productModel.find().exec();
      if (productsArr.length === 0 || !productsArr) {
        throw new NotFoundException('Products not found');
      } else return productsArr;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const product: Product | null = await this.productModel
        .findById(id)
        .exec();
      if (!product) {
        throw new NotFoundException(
          'Product with id: ' + id + ' was not found',
        );
      } else return product;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async deleteProductById(id: string): Promise<string> {
    try {
      const product: Product | null = await this.productModel
        .findByIdAndDelete(id)
        .exec();
      if (!product) {
        throw new NotFoundException(
          'Product with id: ' + id + ' was not found',
        );
      } else return id;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getProductsByField(
    field: string,
    value: string,
  ): Promise<Product[] | null> {
    try {
      value = value.toLowerCase();
      field = field.toLowerCase();
      console.log(value);
      const productsArr: Product[] | null = await this.productModel
        .find({ [field]: value })
        .exec();
      if (productsArr.length === 0 || !productsArr) {
        throw new NotFoundException(
          'This field ' +
            field +
            ' does not exist or products with this field were not found',
        );
      } else return productsArr;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async updateProductById(
    id: string,
    changes: Partial<ProductDto>,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        changes,
        { new: true },
      );
      if (!updatedProduct) {
        throw new NotFoundException(
          'Product with id: ' + id + ' was not found',
        );
      }
      return updatedProduct;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getExpiredProducts(): Promise<Product[]> {
    try {
      const currentDate = new Date();
      const products: Product[] = await this.productModel
        .find({ expirationDate: { $lt: currentDate } })
        .exec();
      if (!products || products.length === 0) {
        throw new NotFoundException('No expired products. Great job!');
      }
      return products;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getExpiringSoonProducts(countDays: number): Promise<Product[]> {
    try {
      const currentDate = new Date();
      const targetDate = currentDate;
      targetDate.setDate(targetDate.getDate() + countDays);
      const products: Product[] = await this.productModel
        .find({ expirationDate: { $gt: currentDate, $lt: targetDate } })
        .exec();
      if (!products || products.length === 0) {
        throw new NotFoundException(
          'No expired products for next ' + countDays + ' days. Great job!',
        );
      }
      return products;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
}
