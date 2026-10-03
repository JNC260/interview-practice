import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import {
  AppointmentSortField,
  SortDirection,
} from './appointments.controller.js';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentsRepository: Repository<Appointment>,
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

  async findByAdvocate({
    advocateId,
    sortBy = AppointmentSortField.SCHEDULED_AT,
    sortDir = SortDirection.DESC,
  }: {
    advocateId: string;
    sortBy?: AppointmentSortField;
    sortDir?: SortDirection;
  }): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { advocateId },
      order: { [sortBy]: sortDir },
      relations: { patient: true, advocate: true },
    });
  }
  // No check-then-insert: the partial unique index on (advocateId,
  // scheduledAt) is the source of truth, so two concurrent requests for the
  // same slot can't both succeed. We translate the constraint error instead.
  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    try {
      return await this.appointmentsRepository.save(
        this.appointmentsRepository.create(dto),
      );
    } catch (err) {
      const code = sqliteErrorCode(err);
      if (code === 'SQLITE_CONSTRAINT_UNIQUE') {
        throw new ConflictException(
          'This advocate already has an appointment at that time',
        );
      }
      if (code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        throw new BadRequestException('Patient or advocate does not exist');
      }
      throw err;
    }
  }
}

function sqliteErrorCode(err: unknown): string | undefined {
  if (!(err instanceof QueryFailedError)) return undefined;
  const driverError = err.driverError as { code?: unknown } | undefined;
  return typeof driverError?.code === 'string' ? driverError.code : undefined;
}
