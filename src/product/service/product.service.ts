import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}
  async getAllProducts(): Promise<ProductDto[]> {
    try {
      const products: ProductDto[] = this.productModel.find().exec();

      if (!products || products.length === 0) {
        throw new NotFoundException('Products not found');
      } else return products
    }
  }
}