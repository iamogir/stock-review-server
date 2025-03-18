import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';
import { ProductMapper } from '../mapping/product.mapper';
import { StockEntryService } from '../../stockEntry/service/stockEntry.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    private readonly stockEntryService: StockEntryService,
  ) {}
  async getAllProducts(): Promise<ProductDto[]> {
    try {
      const products: Product[] = await this.productModel.find().exec();

      if (!products || products.length === 0) {
        throw new NotFoundException('Products not found');
      } else return products.map((pr) => ProductMapper.toDto(pr));
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
  async addNewProduct(product: ProductDto): Promise<ProductDto> {
    try {
      const temp = ProductMapper.fromDto(product);
      const newProduct: Product = new this.productModel({
        ...temp,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return ProductMapper.toDto(await newProduct.save());
    } catch (error) {
      throw new Error('New product was not added: ' + (error as Error).message);
    }
  }
  async deleteProductById(id: string): Promise<{ id: string; count: number }> {
    try {
      const count = await this.stockEntryService.deleteAllEntriesByProductId(id);
      const deleteResult = await this.productModel.findByIdAndDelete(id).exec();
      if (!deleteResult) {
        throw new NotFoundException('Product not found');
      } else {
        return { id, count };
      }
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
}
