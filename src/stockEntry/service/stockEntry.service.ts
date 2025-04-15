import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { StockEntry } from '../schema/stockEntry.schema';
import { StockEntryDto } from '../dto/stockEntry.dto';
import { StockEntryMapper } from '../mapping/stockEntry.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProductDto } from '../../product/dto/product.dto';

@Injectable()
export class StockEntryService {
  constructor(
    @InjectModel(StockEntry.name)
    private readonly stockEntryModel: Model<StockEntry>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.eventEmitter.on(
      //TODO maybe change to emitAsync and return { count }
      'product.deleted',
      (id: string) =>
        void this.deleteAllEntriesByProductId(id).catch((error) =>
          console.error('Fail: ', error),
        ),
    );
  }

  async addNewStockEntry(product: StockEntryDto): Promise<StockEntryDto> {
    try {
      const result = await this.addNewEntriesStack([product]);
      return result.entries[0];
    } catch (error) {
      throw new Error(
        'New stock entry was not added: ' + (error as Error).message,
      );
    }
    // try {
    //   const temp = StockEntryMapper.fromDto(product);
    //   const newProduct: StockEntry = new this.stockEntryModel({
    //     ...temp,
    //     createdAt: new Date(Date.now()),
    //     updatedAt: new Date(Date.now()),
    //   });
    //   if (!newProduct) throw new NotFoundException('entry was not added');
    //   this.eventEmitter.emit(
    //     'entry.added',
    //     Buffer.from(newProduct.productId.id).toString('hex'),
    //   );
    //   return StockEntryMapper.toDto(await newProduct.save());
    // } catch (error) {
    //   throw new Error(
    //     'New stock entry was not added: ' + (error as Error).message,
    //   );
    // }
  }

  async addNewEntriesStack(
    //TODO clean and beauty
    entriesArray: StockEntryDto[],
  ): Promise<{ products: ProductDto[]; entries: StockEntryDto[] }> {
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
      if (!newProducts) throw new Error('Smth went wrong');
      const returnObj = {
        products: [] as ProductDto[],
        entries: [] as StockEntryDto[],
      };

      for (const entry of newProducts) {
        if (entry.productId) {
          const prId = Buffer.from(entry.productId.id).toString('hex');
          const result: ProductDto[] = (await this.eventEmitter.emitAsync(
            'entry.added',
            prId,
            entry.quantityUnits,
          )) as unknown as ProductDto[];
          returnObj.products.push(result[0]);
        }
      }
      //TODO change ProductDto => to Product
      returnObj.entries = newProducts.map((el: StockEntry) =>
        StockEntryMapper.toDto(el),
      );
      console.log(returnObj);
      return returnObj;
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

  async deleteStockEntryById(
    id: string,
  ): Promise<{ entryId: string; product: ProductDto }> {
    try {
      const product: StockEntry | null = await this.stockEntryModel
        .findByIdAndDelete(id)
        .exec();
      if (!product) {
        throw new NotFoundException(
          'Stock entry with id: ' + id + ' was not found',
        );
      } else {
        const returnObj = {
          entryId: id,
          product: {} as ProductDto,
        };
        const temp: ProductDto[] = (await this.eventEmitter.emitAsync(
          'entry.deleted',
          Buffer.from(product.productId.id).toString('hex'),
          product.quantityUnits,
        )) as unknown as ProductDto[];
        returnObj.product = temp[0];
        return returnObj;
      }
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
        await this.eventEmitter.emitAsync('entry.deleted', id, -1);
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

  async deleteUnitsOfProduct(
    id: string,
    count: number,
  ): Promise<StockEntryDto | null> {
    try {
      const oldEntry = await this.stockEntryModel.findById(id).exec();
      if (!oldEntry) {
        throw new NotFoundException('Entry with id: ' + id + ' was not found');
      }
      const quantity = oldEntry.quantityUnits - count;
      if (quantity < 0)
        throw new Error('Counts for deleting are greater than exiting');
      if (quantity === 0) {
        await this.deleteStockEntryById(id);
        await this.eventEmitter.emitAsync('entry.deleted', id, -1);
        return null;
      }
      const entry = await this.updateStockEntryById(id, {
        quantityUnits: quantity,
      });
      if (!entry) {
        throw new NotFoundException('Entry with id: ' + id + ' was not found');
      } else {
        await this.eventEmitter.emitAsync(
          'entry.deleted',
          entry.productId,
          count,
        );
        return entry;
      }
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
