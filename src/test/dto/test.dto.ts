import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import {
  ID_IS_NOT_VALID,
  IS_NOT_NUMBER,
  IS_NOT_STRING,
  SHOULD_NOT_BE_EMPTY,
} from '../../common/const/errors.constants';

export class TestDto {
  @IsUUID('4', { message: ID_IS_NOT_VALID })
  _id: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  name: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  type: string;
  @IsNumber({}, { message: IS_NOT_NUMBER })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  age: number;
}
