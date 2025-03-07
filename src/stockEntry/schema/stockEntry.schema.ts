import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'stock_entries' })
export class StockEntry extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
  @Prop({ required: true }) weight: number;
  @Prop({ required: true }) quantityUnits: number;
  @Prop({ required: true }) expirationDate: Date;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
  @Prop({ required: false }) barcode: string;
  @Prop({ required: true }) supplier: string;
  @Prop({ required: true }) storageLocation: string;
}

export const StockEntrySchema = SchemaFactory.createForClass(StockEntry);
