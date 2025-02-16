import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDto } from '../dto/product.dto';
import { Product } from '../schema/product.schema';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/add_new_product')
  async addProduct(@Body() product: ProductDto) {
    return this.productService.addNewProduct(product);
  }

  @Get('/get_all_products')
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get('/get_product_by_id/:id')
  async getProductById(@Param('id') id: string): Promise<Product | null> {
    return this.productService.getProductById(id);
  }

  @Delete('/delete_product_by_id/:id')
  async deleteProduct(@Param('id') id: string): Promise<string> {
    return this.productService.deleteProductById(id);
  }

  @Get('/get_products_by_category/:category')
  async getProductsByCategory(
    @Param('category') category: string,
  ): Promise<Product[] | string> {
    const pr: Product[] | null =
      await this.productService.getProductsByCategory(category);
    return pr !== null && pr.length > 0 ? pr : 'no such category';
  }
}
