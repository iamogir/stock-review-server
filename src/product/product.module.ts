import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
// import { StockEntryService } from './service/stockEntry.service';
// import { StockEntryController } from './controller/stockEntry.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [],
  providers: [],
})
export class ProductModule {}
