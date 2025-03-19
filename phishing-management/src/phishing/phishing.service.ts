import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreatePhishingDto } from './dto/create-phishing.dto';
import { UpdatePhishingDto } from './dto/update-phishing.dto';
import {
  PhishingAttempt,
  PhishingAttemptDocument,
} from './schemas/phishing-attempt.schema';

@Injectable()
export class PhishingService {
  private simulationApiUrl: string;
  private readonly logger = new Logger(PhishingService.name);

  constructor(
    @InjectModel(PhishingAttempt.name)
    private phishingAttemptModel: Model<PhishingAttemptDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.simulationApiUrl =
      this.configService.get<string>('SIMULATION_API_URL') ||
      'http://localhost:5001';

    this.logger.log(`Configured simulation API URL: ${this.simulationApiUrl}`);
  }

  async create(createPhishingDto: CreatePhishingDto): Promise<PhishingAttempt> {
    const newAttempt = new this.phishingAttemptModel({
      ...createPhishingDto,
      status: 'sent',
    });
    return newAttempt.save();
  }

  async findAll(): Promise<PhishingAttempt[]> {
    return this.phishingAttemptModel.find().exec();
  }

  async findOne(id: string): Promise<PhishingAttempt> {
    const attempt = await this.phishingAttemptModel.findById(id).exec();
    if (!attempt) {
      throw new NotFoundException(`Phishing attempt with id ${id} not found`);
    }
    return attempt;
  }

  async update(
    id: string,
    updatePhishingDto: UpdatePhishingDto,
  ): Promise<PhishingAttempt> {
    const updatedAttempt = await this.phishingAttemptModel
      .findByIdAndUpdate(id, updatePhishingDto, { new: true })
      .exec();
    if (!updatedAttempt) {
      throw new NotFoundException(`Phishing attempt with id ${id} not found`);
    }
    return updatedAttempt;
  }

  async remove(id: string): Promise<void> {
    const result = await this.phishingAttemptModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Phishing attempt with id ${id} not found`);
    }
  }

  async sendPhishingEmail(
    createPhishingDto: CreatePhishingDto,
  ): Promise<PhishingAttempt> {
    this.logger.log(
      `Attempting to send phishing email to ${createPhishingDto.recipientEmail}`,
    );
    this.logger.log(`Using simulation API: ${this.simulationApiUrl}`);

    try {
      const { data } = await firstValueFrom(
        this.httpService.post<any>(
          `${this.simulationApiUrl}/phishing/send`,
          createPhishingDto,
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Successfully sent phishing email to ${createPhishingDto.recipientEmail}`,
      );
      return data as PhishingAttempt;
    } catch (error) {
      this.logger.error(
        `Failed to send phishing email to ${createPhishingDto.recipientEmail}`,
        error.stack,
      );

      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          `Could not connect to simulation API at ${this.simulationApiUrl}. ` +
            `Make sure the simulation service is running and accessible. ` +
            `If using Docker, ensure proper network configuration between containers.`,
        );
      }

      throw new Error(`Failed to send phishing email: ${error.message}`);
    }
  }

  async updateStatus(id: string, status: string): Promise<PhishingAttempt> {
    const updatedAttempt = await this.phishingAttemptModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!updatedAttempt) {
      throw new NotFoundException(`Phishing attempt with id ${id} not found`);
    }
    return updatedAttempt;
  }
}
