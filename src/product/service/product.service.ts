import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';
import { formatString } from '../../common/utils/product.utils';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  async addNewProduct(product: ProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel(product);
      return await newProduct.save();
    } catch (error) {
      throw new Error('New product was not added: ' + (error as Error).message);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const productsArr: Product[] = await this.productModel.find().exec();
      console.log(productsArr[0]._id);
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
      value = formatString(value);
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
}
