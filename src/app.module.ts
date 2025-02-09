import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { APP_FILTER, BaseExceptionFilter } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/stock-review-mongo'),
    ProductModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: BaseExceptionFilter }],
})
export class AppModule {}
