import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'products' })
export class Product extends Document {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) category: string;
  @Prop({ required: false }) brand: string;
  @Prop({ required: true }) status: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
