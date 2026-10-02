import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Patient } from '../patients/patient.entity';
import { Advocate } from '../advocates/advocate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Patient, Advocate])],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
