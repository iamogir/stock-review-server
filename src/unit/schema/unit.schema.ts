import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'units' })
export class Unit extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
  @Prop({ required: true }) weight: number;
  @Prop({ required: true }) expirationDate: Date;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
  @Prop({ required: false }) barcode: string;
  @Prop({ required: true }) storageLocation: string;
}