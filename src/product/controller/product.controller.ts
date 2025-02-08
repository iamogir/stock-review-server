import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async addProduct(@Body() product: ProductDto) {
    return this.productService.create(product);
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }
}
