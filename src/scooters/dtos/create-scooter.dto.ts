import { IsString } from "class-validator";

export class CreateScooterDto {
  @IsString()
  name: string;
}