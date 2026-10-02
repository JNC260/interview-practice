import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { Patient } from '../patients/patient.entity';
import { Advocate } from '../advocates/advocate.entity';

@Entity('insurance')
export class Insurance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Patient)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @Column()
  provider: string;

  @Column()
  policyNumber: string;
}
