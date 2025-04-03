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

@Controller('stock_entries')
export class StockEntryController {
  constructor(
    private readonly stockEntryService: StockEntryService,
  ) {}

  @Post('/add_new_stock_entry')
  async addNewStockEntry(
    @Body() product: StockEntryDto,
  ): Promise<StockEntryDto> {
    return this.stockEntryService.addNewStockEntry(product);
  }

  @Post('/add_new_entries_stack')
  async addNewEntriesStack(
    @Body() entriesArray: StockEntryDto[],
  ): Promise<StockEntryDto[]> {
    return this.stockEntryService.addNewEntriesStack(entriesArray);
  }

  @Get('/get_all_stock_entries')
  async getAllStockEntries(): Promise<StockEntryDto[]> {
    return this.stockEntryService.getAllStockEntries();
  }

  @Get('/get_stock_entry_by_id/:id')
  async getStockEntryById(
    @Param('id') id: string,
  ): Promise<StockEntryDto | null> {
    return this.stockEntryService.getStockEntryById(id);
  }

  @Delete('/delete_stock_entry_by_id/:id')
  async deleteStockEntryById(@Param('id') id: string): Promise<string> {
    return this.stockEntryService.deleteStockEntryById(id);
  }

  @Delete('/delete_all_entries_by_product_id/:id')
  async deleteAllEntriesByProductId(@Param('id') id: string): Promise<number> {
    return this.stockEntryService.deleteAllEntriesByProductId(id);
  }

  @Get(`/get_stock_entries_by`) //get_products_by?field=name&value=Tomato
  async getStockEntriesByField(
    @Query('field') field: string,
    @Query('value') value: string,
  ): Promise<StockEntryDto[] | string> {
    const productsArr: StockEntryDto[] | null =
      await this.stockEntryService.getStockEntriesByField(field, value);
    return productsArr !== null && productsArr.length > 0
      ? productsArr
      : 'no such products';
  }

  @Put('/update_stock_entry_by_id/:id')
  async updateStockEntryById(
    @Param('id') id: string,
    @Body() changes: Partial<StockEntryDto>,
  ): Promise<StockEntryDto> {
    return this.stockEntryService.updateStockEntryById(id, changes);
  }

  @Get('/get_expired_products')
  async getExpiredProducts(): Promise<StockEntryDto[]> {
    return this.stockEntryService.getExpiredProducts();
  }

  @Get('/get_expiring_soon/:count')
  async getExpiringSoonProducts(
    @Param('count') count: string,
  ): Promise<StockEntryDto[]> {
    const number = parseInt(count);
    return this.stockEntryService.getExpiringSoonProducts(number);
  }
}
