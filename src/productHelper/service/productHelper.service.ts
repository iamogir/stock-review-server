import { Injectable, NotFoundException } from '@nestjs/common';
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
      const newProduct: StockEntry =
        await this.stockEntryService.createEntry(temp);
      await this.productService.changeStatus(newProduct.productId.id, true);
      return StockEntryMapper.toDto(newProduct);
    } catch (error) {
      throw new Error(
        'New stock entry was not added: ' + (error as Error).message,
      );
    }
  }
  async deleteProductById(id: string): Promise<{ id: string; count: number }> {
    try {
      const count =
        await this.stockEntryService.deleteAllEntriesByProductId(id);
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
