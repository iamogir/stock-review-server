import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  ID_IS_NOT_VALID,
  IS_NOT_DATE,
  IS_NOT_NUMBER,
  IS_NOT_STRING,
  SHOULD_NOT_BE_EMPTY,
} from '../../common/const/errors.constants';

export class StockEntryDto {
  @IsUUID('4', { message: ID_IS_NOT_VALID })
  _id?: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  productId: string;
  @IsNumber({}, { message: IS_NOT_NUMBER })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  weight: number;
  @IsDate({ message: IS_NOT_DATE })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  expirationDate: Date;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  barcode?: string;
  @IsString({ message: IS_NOT_STRING })
  @IsNotEmpty({ message: SHOULD_NOT_BE_EMPTY })
  storageLocation: string;

  constructor(
    productId: string,
    weight: number,
    expirationDate: Date,
    storageLocation: string,
    _id?: string,
    barcode?: string,
  ) {
    this.productId = productId;
    this.weight = weight;
    this.expirationDate = expirationDate;
    this.storageLocation = storageLocation;
    if (_id) {
      this._id = _id;
    }
    if (barcode) {
      this.barcode = barcode;
    }
  }
}
