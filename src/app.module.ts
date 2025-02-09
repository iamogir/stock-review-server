import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { APP_FILTER, BaseExceptionFilter } from '@nestjs/core';
import { TestModule } from './test/test.module';
// import mongoose from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/testbd'),
    ProductModule,
    TestModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: BaseExceptionFilter }],
})
export class AppModule {}
