import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Rental } from '../rentals/rental.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256 })
  email: string;

  @Column({ length: 32 })
  password: string;

  @Column({default: 'user'})
  role: string;

  @OneToMany(() => Rental, rental => rental.user)
  rental: number;
}