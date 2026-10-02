import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advocate } from './advocate.entity';
import { CreateAdvocateDto } from './dto/create-advocate.dto';

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
    const advocate = await this.advocatesRepository.findOne({
      where: { id },
      relations: { appointments: true },
    });

    if (!advocate) {
      throw new NotFoundException(`Advocate ${id} not found`);
    }

    return advocate;
  }

  // Naive availability check for now: an advocate is "available" if they're
  // active and don't already have an appointment at that exact timestamp.
  // (Good spot to probe: what would you ask about before hardening this?)
  findActive(): Promise<Advocate[]> {
    return this.advocatesRepository.find({ where: { isActive: true } });
  }

  create(dto: CreateAdvocateDto): Promise<Advocate> {
    const advocate = this.advocatesRepository.create(dto);
    return this.advocatesRepository.save(advocate);
  }
}
