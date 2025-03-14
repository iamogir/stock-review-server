import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProductWeight } from '../../common/enums/product.enum';

@Schema({ collection: 'products' })
export class Product extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) category: string;
  @Prop({ required: false }) brand: string;
  @Prop({ required: true }) unitWeight: ProductWeight;
  @Prop({ required: true }) status: boolean;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
