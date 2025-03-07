import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { StockEntryService } from '../service/stockEntry.service';
import { StockEntryDto } from '../dto/stockEntry.dto';
import { StockEntry } from '../schema/stockEntry.schema';

@Controller('stock_entries')
export class StockEntryController {
  constructor(private readonly productService: StockEntryService) {}

  @Post('/add_new_stock_entry')
  async addNewStockEntry(
    @Body() product: StockEntryDto,
  ): Promise<StockEntryDto> {
    return this.productService.addNewStockEntry(product);
  }

  @Get('/get_all_stock_entries')
  async getAllStockEntries(): Promise<StockEntry[]> {
    return this.productService.getAllStockEntries();
  }

  @Get('/get_stock_entry_by_id/:id')
  async getStockEntryById(@Param('id') id: string): Promise<StockEntry | null> {
    return this.productService.getStockEntryById(id);
  }

  @Delete('/delete_stock_entry_by_id/:id')
  async deleteStockEntryById(@Param('id') id: string): Promise<string> {
    return this.productService.deleteStockEntryById(id);
  }

  @Get(`/get_stock_entries_by`) //get_products_by?field=name&value=Tomato
  async getStockEntriesByField(
    @Query('field') field: string,
    @Query('value') value: string,
  ): Promise<StockEntry[] | string> {
    const productsArr: StockEntry[] | null =
      await this.productService.getStockEntriesByField(field, value);
    return productsArr !== null && productsArr.length > 0
      ? productsArr
      : 'no such products';
  }

  @Put('/update_stock_entry_by_id/:id')
  async updateStockEntryById(
    @Param('id') id: string,
    @Body() changes: Partial<StockEntryDto>,
  ) {
    return this.productService.updateStockEntryById(id, changes);
  }

  @Get('/get_expired_products')
  async getExpiredProducts(): Promise<StockEntry[]> {
    return this.productService.getExpiredProducts();
  }

  @Get('/get_expiring_soon/:count')
  async getExpiringSoonProducts(
    @Param('count') count: string,
  ): Promise<StockEntry[]> {
    const number = parseInt(count);
    return this.productService.getExpiringSoonProducts(number);
  }
}
