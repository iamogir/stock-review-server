import { MongooseModule } from '@nestjs/mongoose';
import { StockEntry, StockEntrySchema } from './schema/stockEntry.schema';
import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockEntry.name, schema: StockEntrySchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class StockEntryModule {}
