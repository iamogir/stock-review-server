import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';
import { ProductMapper } from '../mapping/product.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.eventEmitter.on(
      'entry.added',
      (id: Uint8Array) => void this.changeStatus(id, true),
    );
  }
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
  async addNewProductsStack(products: ProductDto[]): Promise<ProductDto[]> {
    try {
      const temp: Partial<Product>[] = [];
      products.map((pr) =>
        temp.push({
          ...ProductMapper.fromDto(pr),
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
      const newProducts: Partial<Product>[] =
        await this.productModel.insertMany(temp);
      return newProducts.map((pr: Product) => ProductMapper.toDto(pr));
    } catch (error) {
      throw new Error(
        'New products were not added: ' + (error as Error).message,
      );
    }
  }
  async deleteProductById(id: string): Promise<string> {
    try {
      const deletedResult = await this.productModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedResult) {
        throw new NotFoundException('Product not found');
      } else {
        this.eventEmitter.emit('product.deleted', id);
        return id;
      }
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
  async changeStatus(id: Uint8Array, status: boolean): Promise<boolean> {
    try {
      const changes = await this.productModel
        .findById(id)
        .set({ status })
        .exec();
      if (!changes) {
        throw new NotFoundException('Product not found');
      } else {
        return true;
      }
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
}
