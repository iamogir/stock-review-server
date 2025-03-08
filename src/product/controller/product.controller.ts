import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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

  @Get(`/get_products_by`) //get_products_by?field=name&value=Tomato
  async getProductsByField(
    @Query('field') field: string,
    @Query('value') value: string,
  ): Promise<Product[] | string> {
    const productsArr: Product[] | null =
      await this.productService.getProductsByField(field, value);
    return productsArr !== null && productsArr.length > 0
      ? productsArr
      : 'no such products';
  }

  @Put('/update_product_by_id/:id')
  async updateProductById(
    @Param('id') id: string,
    @Body() changes: Partial<ProductDto>,
  ) {
    return this.productService.updateProductById(id, changes);
  }

  @Get('/get_expired_products')
  async getExpiredProducts(): Promise<Product[]> {
    return this.productService.getExpiredProducts();
  }

  @Get('/get_expiring_soon/:count')
  async getExpiringSoonProducts(
    @Param('count') count: string,
  ): Promise<Product[]> {
    const number = parseInt(count);
    return this.productService.getExpiringSoonProducts(number);
  }
}
