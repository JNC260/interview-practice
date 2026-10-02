import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { AdvocatesModule } from './advocates/advocates.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { Patient } from './patients/patient.entity';
import { Advocate } from './advocates/advocate.entity';
import { Appointment } from './appointments/appointment.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'solace-practice.sqlite',
      entities: [Patient, Advocate, Appointment],
      // synchronize is fine for this practice repo / sqlite - never use in
      // a real production database, that's what migrations are for.
      synchronize: true,
    }),
    PatientsModule,
    AdvocatesModule,
    AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
