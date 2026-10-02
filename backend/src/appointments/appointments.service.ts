import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Patient } from '../patients/patient.entity';
import { Advocate } from '../advocates/advocate.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(Advocate)
    private readonly advocatesRepository: Repository<Advocate>,
  ) {}

  findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      relations: { patient: true, advocate: true },
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { id },
      relations: { patient: true, advocate: true },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment ${id} not found`);
    }

    return appointment;
  }

  // NOTE (intentionally left simple for practice): this does not yet check
  // whether the advocate already has an appointment at this time. That's a
  // good feature to add yourself - see the README.
  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const patient = await this.patientsRepository.findOne({
      where: { id: dto.patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient ${dto.patientId} not found`);
    }

    const advocate = await this.advocatesRepository.findOne({
      where: { id: dto.advocateId },
    });
    if (!advocate) {
      throw new NotFoundException(`Advocate ${dto.advocateId} not found`);
    }

    const appointment = this.appointmentsRepository.create({
      ...dto,
      scheduledAt: new Date(dto.scheduledAt),
    });

    return this.appointmentsRepository.save(appointment);
  }
}
