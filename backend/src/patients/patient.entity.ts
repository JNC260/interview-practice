import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Appointment } from '../appointments/appointment.entity.js';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  // Comma-separated for simplicity - in production this would likely be a
  // join table.
  @Column({ type: 'varchar', nullable: true })
  conditions: string | null;

  // Relation<> keeps emitDecoratorMetadata from referencing the class
  // eagerly, which would break on the circular import under ESM.
  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointments: Relation<Appointment[]>;

  @CreateDateColumn()
  createdAt: Date;
}
