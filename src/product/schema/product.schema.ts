import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'products' })
export class Product extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) category: string;
  @Prop({ required: true }) weight: number;
  @Prop({ required: true }) unitWeight: string;
  @Prop({ required: true }) quantityUnits: number;
  @Prop({ required: true }) expirationDate: Date;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
  @Prop({ required: false }) barcode: string;
  @Prop({ required: true }) supplier: string;
  @Prop({ required: true }) storageLocation: string;
  @Prop({ required: true }) status: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
