import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class createUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  role: string;
}
