import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PatientsModule } from './patients/patients.module.js';
import { AdvocatesModule } from './advocates/advocates.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { AppointmentActivityModule } from './appointment-activity/appointment-activity.module.js';
import { Patient } from './patients/patient.entity.js';
import { Advocate } from './advocates/advocate.entity.js';
import { Appointment } from './appointments/appointment.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      // Resolved against the working directory, i.e. backend/ when run via
      // npm scripts.
      database: 'dev.sqlite',
      entities: [Patient, Advocate, Appointment],
      // Fine for local sqlite - a real database would use migrations.
      synchronize: true,
    }),
    PatientsModule,
    AdvocatesModule,
    AppointmentsModule,
    AppointmentActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
