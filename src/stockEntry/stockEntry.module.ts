import { MongooseModule } from '@nestjs/mongoose';
import { StockEntry, StockEntrySchema } from './schema/stockEntry.schema';
import { Module } from '@nestjs/common';
import { StockEntryController } from './controller/stockEntry.controller';
import { StockEntryService } from './service/stockEntry.service';
import { ProductHelperModule } from '../productHelper/productHelper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockEntry.name, schema: StockEntrySchema },
    ]),
    ProductHelperModule,
  ],
  controllers: [StockEntryController],
  providers: [StockEntryService],
  exports: [StockEntryService],
})
export class StockEntryModule {}
