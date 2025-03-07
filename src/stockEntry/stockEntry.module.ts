import { MongooseModule } from '@nestjs/mongoose';
import { StockEntry, StockEntrySchema } from './schema/stockEntry.schema';
import { Module } from '@nestjs/common';
import { StockEntryController } from './controller/stockEntry.controller';
import { StockEntryService } from './service/stockEntry.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockEntry.name, schema: StockEntrySchema },
    ]),
  ],
  controllers: [StockEntryController],
  providers: [StockEntryService],
})
export class StockEntryModule {}
