import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AdvocateSpecialty } from '../advocate.entity';

export class CreateAdvocateDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsEnum(AdvocateSpecialty)
  specialty?: AdvocateSpecialty;
}
