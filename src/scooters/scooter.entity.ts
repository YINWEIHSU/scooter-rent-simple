import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm'
import { Rental } from '../rentals/rental.entity'

@Entity()
export class Scooter {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ default: 'available' })
  status: string

  @Column({ default: null })
  currentRental: number

  @OneToMany(() => Rental, rental => rental.scooter)
  rentals: Rental[]
}
