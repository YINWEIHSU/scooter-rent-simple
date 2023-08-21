import { IsString, IsOptional } from 'class-validator'

export class UpdateScooterDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  status?: string
}
