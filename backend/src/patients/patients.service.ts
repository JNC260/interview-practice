import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Patient } from './patient.entity.js';
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
          { fullName: ILike(`%${searchTerm}%`) },
          { conditions: ILike(`%${searchTerm}%`) },
        ],
      });
    }
    return this.patientsRepository.find();
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
}
