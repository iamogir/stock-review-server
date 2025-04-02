import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schema/product.schema';
import { ProductController } from './controller/product.controller';
import { ProductService } from './service/product.service';
// import { StockEntryModule } from '../stockEntry/stockEntry.module';
import { ProductHelperModule } from '../productHelper/productHelper.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    ProductHelperModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
