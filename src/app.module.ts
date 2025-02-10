import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ProductModule } from './product/product.module';
import { APP_FILTER, BaseExceptionFilter } from '@nestjs/core';
import { TestModule } from './test/test.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    // MongooseModule.forRoot('mongodb://localhost:27017/testbd'),
    // ProductModule,
    TestModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: BaseExceptionFilter }],
})
export class AppModule {}
