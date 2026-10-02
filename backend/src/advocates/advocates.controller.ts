import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AdvocatesService } from './advocates.service.js';
import { Advocate } from './advocate.entity.js';
import { CreateAdvocateDto } from './dto/create-advocate.dto.js';

@Controller('advocates')
export class AdvocatesController {
  constructor(private readonly advocatesService: AdvocatesService) {}

  @Get()
  findAll(): Promise<Advocate[]> {
    return this.advocatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Advocate> {
    return this.advocatesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAdvocateDto): Promise<Advocate> {
    return this.advocatesService.create(dto);
  }
}
