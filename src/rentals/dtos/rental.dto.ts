import { Expose } from 'class-transformer'
import { ScooterDto } from '../../scooters/dtos/scooter.dto'
import { UserDto } from '../../users/dtos/user.dto'


export class RentalDto {
  @Expose()
  id: number

  @Expose()
  startTime: Date

  @Expose()
  endTime: Date| null

  @Expose()
  user: UserDto

  @Expose()
  scooter: ScooterDto
}
