import { Injectable } from '@nestjs/common';
import { ProductService } from '../../product/service/product.service';
import { StockEntryService } from '../../stockEntry/service/stockEntry.service';
import { StockEntryDto } from '../../stockEntry/dto/stockEntry.dto';
import { StockEntryMapper } from '../../stockEntry/mapping/stockEntry.mapper';

@Injectable()
export class ProductHelperService {
  constructor(
    private readonly productService: ProductService,
    private readonly stockEntryService: StockEntryService,
  ) {}
  async addNewStockEntry(product: StockEntryDto): Promise<StockEntryDto> {
    try {
      const temp = StockEntryMapper.fromDto(product);
      const newProduct = this.stockEntryService.createEntry(temp);
      await this.productService.changeStatus(newProduct.productId.id, true);
      return StockEntryMapper.toDto(newProduct);
    } catch (error) {
      throw new Error(
        'New stock entry was not added: ' + (error as Error).message,
      );
    }
  }
}
