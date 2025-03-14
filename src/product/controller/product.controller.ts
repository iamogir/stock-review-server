import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/get_all_products')
  async getAllProducts(): Promise<ProductDto[]> {
    return this.productService.getAllProducts();
  }
  @Post('/add_new_product')
  async addNewProduct(@Body() product: ProductDto): Promise<ProductDto> {
    return this.productService.addNewProduct(product);
  }
  @Delete('/delete_product_by_id/:id')
  async deleteProductById(@Param('id') id: string): Promise<string> {
    return this.productService.deleteProductById(id);
  }
}
