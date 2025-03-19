import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import {
  PhishingAttempt,
  PhishingAttemptDocument,
} from './schemas/phishing-attempt.schema';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { PhishingStatus } from './enums/phishing-status.enum';

@Injectable()
export class SimulationService {
  constructor(
    @InjectModel(PhishingAttempt.name)
    private phishingAttemptModel: Model<PhishingAttemptDocument>,
    private configService: ConfigService,
  ) {}

  async sendPhishingEmail(
    createSimulationDto: CreateSimulationDto,
  ): Promise<PhishingAttempt> {
    const newAttempt = new this.phishingAttemptModel({
      ...createSimulationDto,
      status: PhishingStatus.SENT,
    });
    await newAttempt.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    const serverUrl = this.configService.get<string>('SERVER_URL');
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_USER'),
      to: createSimulationDto.recipientEmail,
      subject: 'Phishing Test',
      html: `${createSimulationDto.emailContent} <br><br> <a href="${serverUrl}/phishing/track/${String(newAttempt._id)}">Click here</a>`,
    };

    await transporter.sendMail(mailOptions);
    return newAttempt;
  }

  async trackClick(attemptId: string): Promise<{ message: string }> {
    const attempt = await this.phishingAttemptModel.findById(attemptId);
    if (!attempt) {
      throw new NotFoundException('Phishing attempt not found');
    }
    attempt.status = PhishingStatus.CLICKED;
    await attempt.save();
    return { message: 'Phishing link clicked successfully' };
  }
}
