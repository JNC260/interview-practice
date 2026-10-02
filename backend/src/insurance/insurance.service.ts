import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Insurance } from './insurance.entity';
import { UpdateInsuranceDto } from './dto/updateInsurance.dto';

@Injectable()
export class InsuranceService {
  constructor(
    @InjectRepository(Insurance)
    private readonly insuranceRepository: Repository<Insurance>,
  ) {}

  async findAll(provider?: string): Promise<Insurance[]> {
    if (provider) {
      return this.insuranceRepository.find({ where: { provider } });
    }
    return this.insuranceRepository.find();
  }

  async update(id: string, dto: UpdateInsuranceDto): Promise<Insurance> {
    const insurance = await this.insuranceRepository.findOne({ where: { id } });
    if (!insurance) {
      throw new NotFoundException(`Insurance ${id} not found`);
    }
    this.insuranceRepository.merge(insurance, dto);
    return this.insuranceRepository.save(insurance);
  }

  async remove(id: string): Promise<void> {
    const insurance = await this.insuranceRepository.findOne({ where: { id } });

    if (!insurance) {
      throw new NotFoundException(`Insurance ${id} not found`);
    }

    await this.insuranceRepository.remove(insurance);
  }
}
