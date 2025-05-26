import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ collection: 'units' })
export class Unit extends Document {
  @Prop({ required: true });
}