import { IsNotEmpty, IsNumber } from 'class-validator'

export class createRentalDto {
  @IsNotEmpty()
  @IsNumber()
  scooterId: number
}
