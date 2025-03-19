import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';

@Controller('phishing')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('send')
  async sendPhishing(@Body() createSimulationDto: CreateSimulationDto) {
    return await this.simulationService.sendPhishingEmail(createSimulationDto);
  }

  @Get('track/:id')
  async trackPhishing(@Param('id') id: string) {
    return await this.simulationService.trackClick(id);
  }
}
