import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import { Patient } from './patient.entity.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(@Query('searchTerm') searchTerm?: string): Promise<Patient[]> {
    return this.patientsService.findAll(searchTerm);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(dto);
  }
}
