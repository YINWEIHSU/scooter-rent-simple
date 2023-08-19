import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from '../users/user.entity'
import { Scooter } from '../scooters/scooter.entity';

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.rental)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Scooter, scooter => scooter.rental)
  @JoinColumn({ name: 'scooter_id' })
  scooter: Scooter;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime?: Date | null;
}
