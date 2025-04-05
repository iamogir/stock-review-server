import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ID_IS_NOT_VALID,
  IS_NOT_BOOLEAN,
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
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  brand: string;
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  @IsEnum(ProductWeight, { message: IS_NOT_ENUM })
  unitWeight: ProductWeight;
  @IsBoolean({ message: IS_NOT_BOOLEAN })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  status: boolean;
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: IS_NOT_NUMBER },
  )
  totalQuantity: number;

  constructor(
    name: string,
    category: string,
    brand: string,
    unitWeight: ProductWeight,
    status: boolean,
    totalQuantity: number,
    _id?: string,
  ) {
    this.name = name;
    this.category = category;
    this.brand = brand;
    this.unitWeight = unitWeight;
    this.status = status;
    this.totalQuantity = totalQuantity;
    if (_id) {
      this._id = _id;
    }
  }
}
