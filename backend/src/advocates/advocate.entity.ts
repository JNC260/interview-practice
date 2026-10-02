import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Appointment } from '../appointments/appointment.entity.js';

export enum AdvocateSpecialty {
  CHRONIC_CARE = 'chronic_care',
  ONCOLOGY = 'oncology',
  GENERAL_NAVIGATION = 'general_navigation',
  INSURANCE = 'insurance',
}

@Entity('advocates')
export class Advocate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({
    type: 'simple-enum',
    enum: AdvocateSpecialty,
    default: AdvocateSpecialty.GENERAL_NAVIGATION,
  })
  specialty: AdvocateSpecialty;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Appointment, (appointment) => appointment.advocate)
  appointments: Relation<Appointment[]>;

  @CreateDateColumn()
  createdAt: Date;
}
