import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity'
import { Scooter } from '../scooters/scooter.entity';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.rentals)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Scooter, scooter => scooter.rentals)
  @JoinColumn({ name: 'scooter_id' })
  scooter: Scooter;

  @CreateDateColumn()
  startTime: Date;

  @Column({ nullable: true })
  endTime?: Date | null;
}
