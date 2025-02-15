import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/add_new_product')
  async addProduct(@Body() product: ProductDto) {
    return this.productService.addNewProduct(product);
  }

  @Get('/get_all_products')
  async findAll() {
    return this.productService.findAllProducts();
  }
}
