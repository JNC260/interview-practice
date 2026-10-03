import { PartialType } from '@nestjs/mapped-types';
import { CreateAdvocateDto } from '../../advocates/dto/create-advocate.dto.js';
import { IsUUID, ArrayNotEmpty, ArrayMaxSize } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAdvocateDto) {}

export class BulkAppointmentCancelDto {
  @IsUUID('4', { each: true })
  @ArrayNotEmpty()
  @ArrayMaxSize(100)
  appointmentIds: string[];
}
