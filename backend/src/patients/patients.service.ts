import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Patient, PatientStatus } from './patient.entity.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
  ) {}

  findAll(searchTerm?: string): Promise<Patient[]> {
    if (searchTerm) {
      return this.patientsRepository.find({
        where: [
          { fullName: ILike(`%${searchTerm}%`), status: PatientStatus.ACTIVE },
          {
            conditions: ILike(`%${searchTerm}%`),
            status: PatientStatus.ACTIVE,
          },
        ],
      });
    }
    return this.patientsRepository.find({
      where: { status: PatientStatus.ACTIVE },
    });
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient ${id} not found`);
    }
    return patient;
  }

  create(dto: CreatePatientDto): Promise<Patient> {
    return this.patientsRepository.save(this.patientsRepository.create(dto));
  }

  async delete(id: string) {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient ${id} not found`);
    }
    try {
      await this.patientsRepository.update(id, {
        status: PatientStatus.INACTIVE,
      });
      return JSON.stringify(`Successfully deactivated patient with id ${id}`);
    } catch (e: any) {
      throw new BadRequestException(
        e.message ?? `Unable to deactivate patient with id ${id}`,
      );
    }
  }
}
