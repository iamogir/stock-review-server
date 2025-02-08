import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { ID_IS_NOT_VALID } from '../../common/const/errors.constants';
import {
  ProductStockStatus,
  ProductWeight,
} from '../../common/enums/product.enum';

export class ProductDto {
  @IsUUID('4', { message: ID_IS_NOT_VALID })
  _id: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  category: string;
  @IsNumber()
  @IsNotEmpty()
  quantityKg: number;
  @IsNotEmpty()
  @IsEnum(ProductWeight)
  unitWeight: ProductWeight;
  @IsNumber()
  @IsNotEmpty()
  quantityUnits: number;
  @IsDate()
  @IsNotEmpty()
  expirationDate: Date;
  @IsDate()
  @IsNotEmpty()
  createdAt: Date;
  @IsDate()
  @IsNotEmpty()
  updatedAt: Date;
  @IsString()
  @IsNotEmpty()
  barcode: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsString()
  @IsNotEmpty()
  supplier: string;
  @IsString()
  @IsNotEmpty()
  storageLocation: string;
  @IsEnum(ProductStockStatus)
  @IsNotEmpty()
  status: ProductStockStatus;
}
