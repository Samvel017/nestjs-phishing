import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PhishingController } from './phishing.controller';
import { PhishingService } from './phishing.service';
import {
  PhishingAttempt,
  PhishingAttemptSchema,
} from './schemas/phishing-attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PhishingAttempt.name, schema: PhishingAttemptSchema },
    ]),
    HttpModule,
    ConfigModule,
  ],
  providers: [PhishingService],
  controllers: [PhishingController],
})
export class PhishingModule {}
