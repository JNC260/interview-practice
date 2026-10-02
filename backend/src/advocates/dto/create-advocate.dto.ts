import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { AdvocateSpecialty } from '../advocate.entity.js';

export class CreateAdvocateDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsEnum(AdvocateSpecialty)
  specialty?: AdvocateSpecialty;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
