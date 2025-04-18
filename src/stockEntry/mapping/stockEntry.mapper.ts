import { StockEntry } from '../schema/stockEntry.schema';
import { Types } from 'mongoose';
import { StockEntryDto } from '../dto/stockEntry.dto';

export class StockEntryMapper {
  static fromDto(dto: StockEntryDto): Partial<StockEntry> {
    const objectId = new Types.ObjectId(dto.productId);

    return { ...dto, productId: objectId };
  }

  static toDto(obj: StockEntry): StockEntryDto {
    return new StockEntryDto(
      obj.productId.toString(),
      obj.weight,
      obj.quantityUnits,
      obj.expirationDate,
      obj.supplier,
      obj.storageLocation,
      String(obj._id),
      obj.barcode,
    );
  }
}
