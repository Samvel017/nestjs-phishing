import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PhishingService } from './phishing.service';
import { CreatePhishingDto } from './dto/create-phishing.dto';
import { UpdatePhishingDto } from './dto/update-phishing.dto';
import { PhishingAttempt } from './schemas/phishing-attempt.schema';

@Controller('phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Post()
  create(
    @Body() createPhishingDto: CreatePhishingDto,
  ): Promise<PhishingAttempt> {
    return this.phishingService.create(createPhishingDto);
  }

  @Get()
  findAll(): Promise<PhishingAttempt[]> {
    return this.phishingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PhishingAttempt> {
    return this.phishingService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePhishingDto: UpdatePhishingDto,
  ): Promise<PhishingAttempt> {
    return this.phishingService.update(id, updatePhishingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.phishingService.remove(id);
  }

  @Post('send')
  async sendPhishingEmail(
    @Body() createPhishingDto: CreatePhishingDto,
  ): Promise<PhishingAttempt> {
    return this.phishingService.sendPhishingEmail(createPhishingDto);
  }

  @Get('click/:id')
  handleClick(@Param('id') id: string): Promise<PhishingAttempt> {
    return this.phishingService.updateStatus(id, 'clicked');
  }
}
