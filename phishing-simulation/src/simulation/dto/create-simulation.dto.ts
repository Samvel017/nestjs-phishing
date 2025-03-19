import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSimulationDto {
  @IsNotEmpty()
  @IsEmail()
  recipientEmail: string;

  @IsNotEmpty()
  @IsString()
  emailContent: string;
}
