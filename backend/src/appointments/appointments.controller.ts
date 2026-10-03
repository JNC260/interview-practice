import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service.js';
import { Appointment } from './appointment.entity.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';

export enum AppointmentSortOptions {
  DATEASC = 'dateAsc',
  DATEDESC = 'dateDesc',
  STATUSASC = 'statusAsc',
  STATUSDESC = 'statusDesc',
}

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  findAll(): Promise<Appointment[]> {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Appointment> {
    return this.appointmentsService.findOne(id);
  }

  @Get('/byAdvocate/:advocateId')
  findByAdvocate(
    @Param('advocateId', ParseUUIDPipe) advocateId: string,
    @Query(
      'sort',
      new ParseEnumPipe(AppointmentSortOptions, { optional: true }),
    )
    sort?: AppointmentSortOptions,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findByAdvocate(advocateId, sort);
  }

  @Post()
  create(@Body() dto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(dto);
  }
}
