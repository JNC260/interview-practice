import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './patient.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(@Query('searchTerm') searchTerm?: string): Promise<Patient[]> {
    return this.patientsService.findAll(searchTerm);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(dto);
  }
}
