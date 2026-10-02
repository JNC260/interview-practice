import { PartialType } from '@nestjs/mapped-types';
import { CreateInsuranceDto } from './createInsurance.dto';

export class UpdateInsuranceDto extends PartialType(CreateInsuranceDto) {}
