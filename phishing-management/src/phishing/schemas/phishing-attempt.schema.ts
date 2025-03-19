import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PhishingStatus } from '../enums/phishing-status.enum';

export type PhishingAttemptDocument = PhishingAttempt & Document;

@Schema()
export class PhishingAttempt {
  @Prop({ required: true })
  recipientEmail: string;

  @Prop({ required: true })
  emailContent: string;

  @Prop({ required: true, enum: PhishingStatus })
  status: PhishingStatus;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const PhishingAttemptSchema =
  SchemaFactory.createForClass(PhishingAttempt);
