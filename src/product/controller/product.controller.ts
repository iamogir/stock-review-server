import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDto } from '../dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('/get_all_products')
  async getAllProducts(): Promise<ProductDto[]> {
    return this.productService.getAllProducts();
  }
}
