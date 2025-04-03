import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StockEntry } from '../schema/stockEntry.schema';
import { StockEntryDto } from '../dto/stockEntry.dto';
import { StockEntryMapper } from '../mapping/stockEntry.mapper';
import { ProductService } from '../../product/service/product.service';

@Injectable()
export class StockEntryService {
  constructor(
    @InjectModel(StockEntry.name)
    private readonly stockEntryModel: Model<StockEntry>,
    private readonly productService: ProductService,
  ) {}

  async addNewStockEntry(product: StockEntryDto): Promise<StockEntryDto> {
    try {
      const temp = StockEntryMapper.fromDto(product);
      const newProduct: StockEntry = new this.stockEntryModel({
        ...temp,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      });
      await this.productService.changeStatus(newProduct.productId.id, true);
      return StockEntryMapper.toDto(await newProduct.save());
    } catch (error) {
      throw new Error(
        'New stock entry was not added: ' + (error as Error).message,
      );
    }
  }

  async addNewEntriesStack(
    entriesArray: StockEntryDto[],
  ): Promise<StockEntryDto[]> {
    try {
      const temp: Partial<StockEntry>[] = [];
      entriesArray.map((en) =>
        temp.push({
          ...StockEntryMapper.fromDto(en),
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
        }),
      );
      const newProducts: Partial<StockEntry>[] =
        await this.stockEntryModel.insertMany(temp);

      return newProducts.map((el: StockEntry) => StockEntryMapper.toDto(el));
    } catch (error) {
      throw new Error(
        'New stock entry was not added: ' + (error as Error).message,
      );
    }
  }

  async getAllStockEntries(): Promise<StockEntryDto[]> {
    try {
      const productsArr: StockEntry[] = await this.stockEntryModel
        .find()
        .exec();
      if (productsArr.length === 0 || !productsArr) {
        throw new NotFoundException('Stock entries not found');
      } else return productsArr.map((pr) => StockEntryMapper.toDto(pr));
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getStockEntryById(id: string): Promise<StockEntryDto | null> {
    try {
      const product: StockEntry | null = await this.stockEntryModel
        .findById(id)
        .exec();
      if (!product) {
        throw new NotFoundException('Entry with id: ' + id + ' was not found');
      } else return StockEntryMapper.toDto(product);
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async deleteStockEntryById(id: string): Promise<string> {
    try {
      const product: StockEntry | null = await this.stockEntryModel
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

  async deleteAllEntriesByProductId(id: string): Promise<number> {
    try {
      const deleteResult = await this.stockEntryModel.deleteMany({
        productId: new Types.ObjectId(id),
      });
      if (!deleteResult) {
        throw new NotFoundException('Entries by this product were not found');
      } else {
        return deleteResult.deletedCount;
      }
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getStockEntriesByField(
    field: string,
    value: string,
  ): Promise<StockEntryDto[] | null> {
    try {
      value = value.toLowerCase();
      field = field.toLowerCase();
      console.log(value);
      const productsArr: StockEntry[] | null = await this.stockEntryModel
        .find({ [field]: value })
        .exec();
      if (productsArr.length === 0 || !productsArr) {
        throw new NotFoundException(
          'This field ' +
            field +
            ' does not exist or entry with this field were not found',
        );
      } else return productsArr.map((pr) => StockEntryMapper.toDto(pr));
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async updateStockEntryById(
    id: string,
    changes: Partial<StockEntryDto>,
  ): Promise<StockEntryDto> {
    try {
      const updatedProduct = await this.stockEntryModel.findByIdAndUpdate(
        id,
        changes,
        { new: true },
      );
      if (!updatedProduct) {
        throw new NotFoundException('Entry with id: ' + id + ' was not found');
      }
      return StockEntryMapper.toDto(updatedProduct);
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getExpiredProducts(): Promise<StockEntryDto[]> {
    try {
      const currentDate = new Date();
      const products: StockEntry[] = await this.stockEntryModel
        .find({ expirationDate: { $lt: currentDate } })
        .exec();
      if (!products || products.length === 0) {
        throw new NotFoundException('No expired products. Great job!');
      }
      return products.map((pr) => StockEntryMapper.toDto(pr));
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }

  async getExpiringSoonProducts(countDays: number): Promise<StockEntryDto[]> {
    try {
      const currentDate = new Date();
      const targetDate = new Date(currentDate);
      targetDate.setDate(targetDate.getDate() + countDays);
      const products: StockEntry[] = await this.stockEntryModel
        .find({ expirationDate: { $gt: currentDate, $lt: targetDate } })
        .exec();
      if (!products || products.length === 0) {
        throw new NotFoundException(
          'No expired products for next ' + countDays + ' days. Great job!',
        );
      }
      return products.map((pr) => StockEntryMapper.toDto(pr));
    } catch (error) {
      throw new Error('Something went wrong: ' + (error as Error).message);
    }
  }
}
