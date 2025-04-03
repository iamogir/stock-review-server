import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ProductDto } from '../dto/product.dto';
import { ProductHelperService } from '../../productHelper/service/productHelper.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productHelperService: ProductHelperService,
  ) {}

  @Get('/get_all_products')
  async getAllProducts(): Promise<ProductDto[]> {
    return this.productService.getAllProducts();
  }
  @Post('/add_new_product')
  async addNewProduct(@Body() product: ProductDto): Promise<ProductDto> {
    return this.productService.addNewProduct(product);
  }
  @Post('/add_new_products_stack')
  async addNewProductsStack(@Body() products: ProductDto[]): Promise<ProductDto[]> {
    return this.productService.addNewProductsStack(products);
  }
  @Delete('/delete_product_by_id/:id')
  async deleteProductById(
    @Param('id') id: string,
  ): Promise<{ id: string; count: number }> {
    return this.productHelperService.deleteProductById(id);
  }
}
