import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../schema/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dto/product.dto';
import { ProductMapper } from '../mapping/product.mapper';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  @OnEvent('entry.added')
  async handleEntryAdded(
    id: string,
    quantityUnits: number,
  ): Promise<ProductDto> {
    const product = await this.productModel.findById(id).exec();
    if (!product)
      //TODO make beautiful
      throw new NotFoundException(`Product with id ${id} not found`);
    await this.changeTotalQuantity(id, product.totalQuantity + quantityUnits);
    if (product.status) {
      const newProduct = await this.productModel.findById(id).exec();
      if (newProduct) {
        return ProductMapper.toDto(newProduct);
      } else throw new NotFoundException(`Product with id ${id} not found`);
    } else {
      await this.changeStatus(id, true);
      const newProduct = await this.productModel.findById(id).exec();
      if (newProduct) {
        return ProductMapper.toDto(newProduct);
      } else throw new NotFoundException(`Product with id ${id} not found`);
    }
  }
  @OnEvent('entry.deleted')
  async handleEntryDeleted(id: string, quantityUnitsToDelete: number) {
    console.log('START');
    const product = await this.productModel.findById(id).exec();
    if (!product || product.totalQuantity <= 0) return;

    console.log('before');
    if (quantityUnitsToDelete < 0) {
      console.log('in');
      await this.changeTotalQuantity(id, 0);
      await this.changeStatus(id, false);
      return;
    }
    console.log('after');
    const quantity = product.totalQuantity - quantityUnitsToDelete;
    console.log(quantity + ' PPPPPPPPPP');
    await this.changeTotalQuantity(id, quantity < 0 ? 0 : quantity);
    if (quantity <= 0) {
      await this.changeStatus(id, false);
    }
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
      const result = await this.addNewProductsStack([product]);
      return result[0];
    } catch (error) {
      throw new Error(
        'New products were not added: ' + (error as Error).message,
      );
    }
    // try {
    //   const temp = ProductMapper.fromDto(product);
    //   const newProduct: Product = new this.productModel({
    //     ...temp, // { status: false, totalQuantity: 0 }
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   });
    //   return ProductMapper.toDto(await newProduct.save());
    // } catch (error) {
    //   throw new Error('New product was not added: ' + (error as Error).message);
    // }
  }
  async addNewProductsStack(products: ProductDto[]): Promise<ProductDto[]> {
    try {
      const temp: Partial<Product>[] = [];
      products.map((pr) =>
        temp.push({
          ...ProductMapper.fromDto(pr), // { status: false, totalQuantity: 0 }
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
  async changeStatus(id: string, status: boolean): Promise<boolean> {
    console.log('status');
    try {
      const changes = await this.productModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
      if (!changes) {
        throw new NotFoundException('Product not found');
      } else {
        console.log('Change');
        return true;
      }
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
  async changeTotalQuantity(
    id: string,
    totalQuantity: number,
  ): Promise<boolean> {
    console.log('quantity');
    try {
      console.log(totalQuantity);
      const changes = await this.productModel.findByIdAndUpdate(
        id,
        { totalQuantity },
        { new: true },
      );
      if (!changes) {
        throw new NotFoundException('Product not found');
      } else {
        console.log('Change');
        return true;
      }
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
  // async changeTotalQuantity(id: string, quantity: number): Promise<number> {
  //   try {
  //     const changes = await this.productModel.findByIdAndUpdate(
  //       id,
  //       { quantity },
  //       { new: true },
  //     );
  //     if (!changes) {
  //       throw new NotFoundException('Product not found');
  //     } else {
  //       return quantity;
  //     }
  //   } catch (error) {
  //     throw new Error('Something went wrong: ' + (error as Error).message);
  //   }
  // }
  async updateProductById(
    id: string,
    changes: Partial<ProductDto>,
  ): Promise<ProductDto> {
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
      return ProductMapper.toDto(updatedProduct);
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
}
