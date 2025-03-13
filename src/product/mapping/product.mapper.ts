import { Product } from '../schema/product.schema';
import { ProductDto } from '../dto/product.dto';

export class ProductMapper {
  // static fromDto(dto: ProductDto): Partial<Product> {
  //   return { ...dto };
  // }
  static toDto(obj: Product): ProductDto {
    return new ProductDto(
      obj.name,
      obj.category,
      obj.brand,
      obj.unitWeight,
      obj.status,
      String(obj._id),
    );
  }
  static fromDto(dto: ProductDto): Partial<Product> {
    return { ...dto };
  }
}
