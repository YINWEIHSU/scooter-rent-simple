import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rental } from '../rentals/rental.entity';

@Entity()
export class Scooter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'available' })
  status: string;

  @OneToMany(() => Rental, rental => rental.scooter)
  rental: number;
}