import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ID_IS_NOT_VALID,
  IS_NOT_DATE,
  IS_NOT_ENUM,
  IS_NOT_NUMBER,
  IS_NOT_STRING,
  SHOULD_NOT_BE_EMPTY,
} from '../../common/const/errors.constants';
import { ProductWeight } from '../../common/enums/product.enum';
import { ProductDto } from '../../product/dto/product.dto';

export class StockEntryDto {
  // @IsUUID('4', { message: ID_IS_NOT_VALID })
  // entryId?: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  productId: string;
  @IsNumber({}, { message: IS_NOT_NUMBER })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  weight: number;
  @IsNumber({}, { message: IS_NOT_NUMBER })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  quantityUnits: number;
  @IsDate({ message: IS_NOT_DATE })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  expirationDate: Date;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  barcode?: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  supplier: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  storageLocation: string;

  constructor(
    productId: string,
    weight: number,
    quantityUnits: number,
    expirationDate: Date,
    supplier: string,
    storageLocation: string,
    barcode?: string,
  ) {
    this.productId = productId;
    this.weight = weight;
    this.quantityUnits = quantityUnits;
    this.expirationDate = expirationDate;
    this.supplier = supplier;
    this.storageLocation = storageLocation;

    if (barcode) {
      this.barcode = barcode;
    }
  }
}
