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

export enum AppointmentSortField {
  SCHEDULED_AT = 'scheduledAt',
  STATUS = 'status',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
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
      'sortBy',
      new ParseEnumPipe(AppointmentSortField, { optional: true }),
    )
    sortBy?: AppointmentSortField,
    @Query('sortDir', new ParseEnumPipe(SortDirection, { optional: true }))
    sortDir?: SortDirection,
  ): Promise<Appointment[]> {
    return this.appointmentsService.findByAdvocate({
      advocateId,
      sortBy,
      sortDir,
    });
  }

  @Post()
  create(@Body() dto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(dto);
  }
}
