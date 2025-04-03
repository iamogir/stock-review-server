import { Injectable } from '@nestjs/common';
import { ProductService } from '../../product/service/product.service';
import { StockEntryService } from '../../stockEntry/service/stockEntry.service';
import { StockEntryDto } from '../../stockEntry/dto/stockEntry.dto';
import { StockEntryMapper } from '../../stockEntry/mapping/stockEntry.mapper';
import { StockEntry } from '../../stockEntry/schema/stockEntry.schema';

@Injectable()
export class ProductHelperService {
  constructor(
    private readonly productService: ProductService,
    private readonly stockEntryService: StockEntryService,
  ) {}
  async addNewStockEntry(product: StockEntryDto): Promise<StockEntryDto> {
    try {
      const temp = StockEntryMapper.fromDto(product);
      const newProduct: StockEntry = new this.stockEntryService.stockEntryModel({
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
}
