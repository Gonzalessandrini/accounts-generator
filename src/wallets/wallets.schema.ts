import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Wallet extends Document {
  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ required: true })
  mnemonic: string;

  @Prop({ required: true })
  network: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
