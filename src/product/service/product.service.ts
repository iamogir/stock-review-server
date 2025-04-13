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
    const product = await this._getProductSchema(id);
    await this.changeTotalQuantity(id, product.totalQuantity + quantityUnits);
    if (!product.status) await this.changeStatus(id, true);
    return ProductMapper.toDto(await this._getProductSchema(id));
  }
  @OnEvent('entry.deleted')
  async handleEntryDeleted(
    id: string,
    quantityUnitsToDelete: number,
  ): Promise<ProductDto> {
    const product = await this._getProductSchema(id);
    if (product.totalQuantity <= 0)
      throw new NotFoundException(`Product with id ${id} not found`);

    if (quantityUnitsToDelete < 0) {
      await this.changeTotalQuantity(id, 0);
      await this.changeStatus(id, false);
    } else {
      const quantity = product.totalQuantity - quantityUnitsToDelete;
      await this.changeTotalQuantity(id, quantity < 0 ? 0 : quantity);
      if (quantity <= 0) {
        await this.changeStatus(id, false);
      }
    }
    return ProductMapper.toDto(await this._getProductSchema(id));
  }
  private async _getProductSchema(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product)
        throw new NotFoundException(`Product with id ${id} not found`);
      return product;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
  public async getAllProducts(): Promise<ProductDto[]> {
    try {
      const products: Product[] = await this.productModel.find().exec();

      if (!products || products.length === 0) {
        throw new NotFoundException('Products not found');
      } else return products.map((pr) => ProductMapper.toDto(pr));
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
  public async addNewProduct(product: ProductDto): Promise<ProductDto> {
    try {
      const result = await this.addNewProductsStack([product]);
      return result[0];
    } catch (error) {
      throw new Error(
        'New products were not added: ' + (error as Error).message,
      );
    }
  }
  public async addNewProductsStack(
    products: ProductDto[],
  ): Promise<ProductDto[]> {
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
  public async getProductById(id: string): Promise<ProductDto> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product)
        throw new NotFoundException(`Product with id ${id} not found`);
      return ProductMapper.toDto(product);
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
  public async deleteProductById(id: string): Promise<string> {
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
  async updateProductById(
    id: string,
    changes: Partial<ProductDto>,
  ): Promise<ProductDto> {
    try {
      Object.keys(changes).forEach((key: string) => {
        if (typeof changes[key] === 'string')
          changes[key] = changes[key].toLowerCase();
      });
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
