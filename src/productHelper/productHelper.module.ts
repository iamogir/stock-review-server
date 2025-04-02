import { Module } from '@nestjs/common';

@Module({
  providers: [ProductHelperService],
  exports: [ProductHelperService],
})
export class ProductHelperModule {}
