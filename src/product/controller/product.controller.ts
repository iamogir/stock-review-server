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
  @Post('/add_new_products_stack')
  async addNewProductsStack(
    @Body() products: ProductDto[],
  ): Promise<ProductDto[]> {
    return this.productService.addNewProductsStack(products);
  }
  @Get('/get_product_by_id/:id')
  async getProductByID(@Param('id') id: string): Promise<ProductDto> {
    return this.productService.getProductById(id);
  }
  @Delete('/delete_product_by_id/:id')
  async deleteProductById(@Param('id') id: string): Promise<string> {
    return this.productService.deleteProductById(id);
  }
  @Post('/update_product_by_id/:id')
  async updateProductById(
    @Param('id') id: string,
    @Body() changes: Partial<ProductDto>,
  ): Promise<ProductDto> {
    return this.productService.updateProductById(id, changes);
  }
}
