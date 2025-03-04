import { MongooseModule } from '@nestjs/mongoose';
import { StockEntry, StockEntrySchema } from './schema/stockEntry.schema';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([{name: StockEntry.name, schema: StockEntrySchema }]),
  ],
  controllers: [],
  providers: [],
})
export class StockEntryModule {}