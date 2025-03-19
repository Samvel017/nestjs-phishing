import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePhishingDto {
  @IsNotEmpty()
  @IsEmail()
  recipientEmail: string;

  @IsNotEmpty()
  @IsString()
  emailContent: string;
}
