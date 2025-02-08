import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) category: string;
  @Prop({ required: true }) quantityKg: number;
  @Prop({ required: true }) unitWeight: string;
  @Prop({ required: true }) quantityUnits: number;
  @Prop({ required: true }) expirationDate: Date;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
  @Prop({ required: true }) barcode: string;
  @Prop({ required: true }) supplier: string;
  @Prop({ required: true }) storageLocation: string;
  @Prop({ required: true }) status: string;
}
