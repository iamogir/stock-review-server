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
      const newProduct = new this.productModel(product);
      return await newProduct.save();
    } catch (error) {
      throw new Error('New product was not added: ' + (error as Error).message);
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const productArr: Product[] = await this.productModel.find().exec();
      if (productArr.length === 0 || !productArr) {
        throw new NotFoundException('Products not found');
      } else return productArr;
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
    await this.productModel.findByIdAndDelete(id).exec();
    return id;
  }

  async getProductsByCategory(category: string): Promise<Product[] | null> {
    const pr: Product[] = await this.productModel
      .find({ category: category })
      .exec();
    return pr.length > 0 ? pr : null;
  }
}
