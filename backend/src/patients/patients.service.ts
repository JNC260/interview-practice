import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { ILike } from 'typeorm';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
  ) {}

  findAll(searchTerm?: string): Promise<Patient[]> {
    if (searchTerm) {
      const results = this.patientsRepository
        .createQueryBuilder('patient')
        .where(
          new Brackets((qb) => {
            qb.where("LOWER(patient.fullName) LIKE :term ESCAPE '\\'", {
              searchTerm,
            }).orWhere(
              "LOWER(patient.conditions) LIKE :searchTerm ESCAPE '\\'",
              {
                searchTerm,
              },
            );
          }),
        )
        .getMany();
      return results;
    }
    return this.patientsRepository.find();
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: { appointments: true },
    });

    if (!patient) {
      throw new NotFoundException(`Patient ${id} not found`);
    }

    return patient;
  }

  create(dto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientsRepository.create(dto);
    return this.patientsRepository.save(patient);
  }
}
