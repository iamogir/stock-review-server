import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { APP_FILTER, BaseExceptionFilter } from '@nestjs/core';
import { TestModule } from './test/test.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as cors from 'cors';

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
    ProductModule,
    TestModule,
  ],
  providers: [{ provide: APP_FILTER, useClass: BaseExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cors({
          origin: 'http://localhost:5173',
          credentials: true,
        }),
      )
      .forRoutes('*');
  }
}
