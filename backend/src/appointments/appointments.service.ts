import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, In } from 'typeorm';
import { Appointment } from './appointment.entity.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import {
  AppointmentSortField,
  SortDirection,
} from './appointments.controller.js';
import { AppointmentStatus } from './appointment.entity.js';

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

  async bulkAppointmentCancel(
    ids: string[],
  ): Promise<{ success: string[]; fail: { id: string; reason: string }[] }> {
    const result = await this.appointmentsRepository
      .createQueryBuilder()
      .update(Appointment)
      .set({ status: AppointmentStatus.CANCELLED })
      .where('id IN (:...ids)', { ids })
      .andWhere('status != :completed', {
        completed: AppointmentStatus.COMPLETED,
      })
      .execute();

    const success: string[] = result.raw.map((row: { id: string }) => row.id);

    // Anything in the original list that ISN'T in `succeeded` either didn't
    // exist, or was already completed. One cheap follow-up query to tell
    // those two cases apart for the error message, rather than N queries.
    const failedIds = ids.filter((id) => !success.includes(id));
    const fail: { id: string; reason: string }[] = [];

    if (failedIds.length > 0) {
      const foundButNotUpdated = await this.appointmentsRepository.find({
        where: { id: In(failedIds) },
        select: { id: true, status: true },
      });
      const foundIds = new Set(foundButNotUpdated.map((a) => a.id));

      for (const id of failedIds) {
        if (!foundIds.has(id)) {
          fail.push({ id, reason: 'Appointment not found' });
        } else {
          fail.push({ id, reason: 'Appointment is already completed' });
        }
      }
    }

    return { success, fail };
  }
}

function sqliteErrorCode(err: unknown): string | undefined {
  if (!(err instanceof QueryFailedError)) return undefined;
  const driverError = err.driverError as { code?: unknown } | undefined;
  return typeof driverError?.code === 'string' ? driverError.code : undefined;
}
