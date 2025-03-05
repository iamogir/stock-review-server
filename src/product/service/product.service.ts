import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StockEntry } from '../schema/stockEntry.schema';
import { StockEntryDto } from '../dto/stockEntry.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(StockEntry.name) private productModel: Model<StockEntry>,
  ) {}
  async addNewStockEntry(product: StockEntryDto): Promise<StockEntry> {
    try {
      const newProduct = new this.productModel({
        ...product,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      });
      return await newProduct.save();
    } catch (error) {
      throw new Error(
        'New stock entry was not added: ' + (error as Error).message,
      );
    }
  }

  async getAllStockEntries(): Promise<StockEntry[]> {
    try {
      const productsArr: StockEntry[] = await this.productModel
        .find()
        .populate('productId')
        .exec();
      console.log(productsArr[0].productId);
      if (productsArr.length === 0 || !productsArr) {
        throw new NotFoundException('Products not found');
      } else return productsArr;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getStockEntryById(id: string): Promise<StockEntry | null> {
    try {
      const product: StockEntry | null = await this.productModel
        .findById(id)
        .populate('productId')
        .exec();
      if (!product) {
        throw new NotFoundException('Entry with id: ' + id + ' was not found');
      } else return product;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async deleteStockEntryById(id: string): Promise<string> {
    try {
      const product: StockEntry | null = await this.productModel
        .findByIdAndDelete(id)
        .exec();
      if (!product) {
        throw new NotFoundException(
          'Stock entry with id: ' + id + ' was not found',
        );
      } else return id;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getStockEntriesByField(
    field: string,
    value: string,
  ): Promise<StockEntry[] | null> {
    try {
      value = value.toLowerCase();
      field = field.toLowerCase();
      console.log(value);
      const productsArr: StockEntry[] | null = await this.productModel
        .find({ [field]: value })
        .populate('productId')
        .exec();
      if (productsArr.length === 0 || !productsArr) {
        throw new NotFoundException(
          'This field ' +
            field +
            ' does not exist or entry with this field were not found',
        );
      } else return productsArr;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async updateStockEntryById(
    id: string,
    changes: Partial<StockEntryDto>,
  ): Promise<StockEntry> {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        changes,
        { new: true },
      );
      if (!updatedProduct) {
        throw new NotFoundException('Entry with id: ' + id + ' was not found');
      }
      return updatedProduct;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getExpiredProducts(): Promise<StockEntry[]> {
    try {
      const currentDate = new Date();
      const products: StockEntry[] = await this.productModel
        .find({ expirationDate: { $lt: currentDate } })
        .populate('productId')
        .exec();
      if (!products || products.length === 0) {
        throw new NotFoundException('No expired products. Great job!');
      }
      return products;
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getExpiringSoonProducts(countDays: number): Promise<StockEntry[]> {
    try {
      const currentDate = new Date();
      const targetDate = new Date(currentDate);
      targetDate.setDate(targetDate.getDate() + countDays);
      const products: StockEntry[] = await this.productModel
        .find({ expirationDate: { $gt: currentDate, $lt: targetDate } })
        .populate('productId')
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
