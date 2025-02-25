import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ID_IS_NOT_VALID,
  IS_NOT_BOOLEAN,
  IS_NOT_DATE,
  IS_NOT_ENUM,
  IS_NOT_NUMBER,
  IS_NOT_STRING,
  SHOULD_NOT_BE_EMPTY,
} from '../../common/const/errors.constants';
import { ProductWeight } from '../../common/enums/product.enum';

export class ProductDto {
  @IsUUID('4', { message: ID_IS_NOT_VALID })
  _id?: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  name: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  category: string;
  @IsNumber({}, { message: IS_NOT_NUMBER })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  weight: number;
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  @IsEnum(ProductWeight, { message: IS_NOT_ENUM })
  unitWeight: ProductWeight;
  @IsNumber({}, { message: IS_NOT_NUMBER })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  quantityUnits: number;
  @IsDate({ message: IS_NOT_DATE })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  expirationDate: Date;
  @IsDate({ message: IS_NOT_DATE })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  createdAt: Date;
  @IsDate({ message: IS_NOT_DATE })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  updatedAt: Date;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  barcode?: string;
  @IsNumber({}, { message: IS_NOT_NUMBER })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  price: number;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  supplier: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  storageLocation: string;
  @IsBoolean({ message: IS_NOT_BOOLEAN })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  status: boolean;
}
