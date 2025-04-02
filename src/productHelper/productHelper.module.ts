import { Module } from '@nestjs/common';
import { ProductHelperService } from './service/productHelper.service';

@Module({
  providers: [ProductHelperService],
  exports: [ProductHelperService],
})
export class ProductHelperModule {}
