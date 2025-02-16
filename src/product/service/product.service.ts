import { Injectable } from '@nestjs/common';
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
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findProductById(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
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
