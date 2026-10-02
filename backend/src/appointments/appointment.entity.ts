import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Patient } from '../patients/patient.entity.js';
import { Advocate } from '../advocates/advocate.entity.js';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export const ADVOCATE_SLOT_INDEX = 'UQ_appointments_advocate_slot';

@Entity('appointments')
// Partial unique index: an advocate can't have two non-cancelled appointments
// at the same instant, but a cancelled slot can be rebooked.
@Index(ADVOCATE_SLOT_INDEX, ['advocateId', 'scheduledAt'], {
  unique: true,
  where: `"status" != '${AppointmentStatus.CANCELLED}'`,
})
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => Patient, (patient) => patient.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Relation<Patient>;

  @Column()
  advocateId: string;

  @ManyToOne(() => Advocate, (advocate) => advocate.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'advocateId' })
  advocate: Relation<Advocate>;

  @Column()
  scheduledAt: Date;

  @Column({
    type: 'simple-enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ type: 'varchar', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
