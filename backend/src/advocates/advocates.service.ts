import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advocate } from './advocate.entity.js';
import { CreateAdvocateDto } from './dto/create-advocate.dto.js';

@Injectable()
export class AdvocatesService {
  constructor(
    @InjectRepository(Advocate)
    private readonly advocatesRepository: Repository<Advocate>,
  ) {}

  findAll(): Promise<Advocate[]> {
    return this.advocatesRepository.find();
  }

  async findOne(id: string): Promise<Advocate> {
    const advocate = await this.advocatesRepository.findOneBy({ id });
    if (!advocate) {
      throw new NotFoundException(`Advocate ${id} not found`);
    }
    return advocate;
  }

  create(dto: CreateAdvocateDto): Promise<Advocate> {
    return this.advocatesRepository.save(this.advocatesRepository.create(dto));
  }
}
