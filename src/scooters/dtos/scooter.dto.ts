import { Expose } from "class-transformer";

export class ScooterDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  status: string;
}