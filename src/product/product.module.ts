import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
import { StockEntryModule } from '../stockEntry/stockEntry.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    StockEntryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
