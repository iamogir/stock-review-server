import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import {
  ID_IS_NOT_VALID,
  IS_NOT_BOOLEAN,
  IS_NOT_STRING,
  SHOULD_NOT_BE_EMPTY,
} from '../../common/const/errors.constants';

export class ProductDto {
  @IsUUID('4', { message: ID_IS_NOT_VALID })
  productId?: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  name: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  category: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  brand: string;
  @IsBoolean({ message: IS_NOT_BOOLEAN })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  status: boolean;
}
