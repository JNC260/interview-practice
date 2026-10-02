import { IsString, IsUUID } from 'class-validator';

export class CreateInsuranceDto {
  @IsString()
  provider: string;

  @IsString()
  policyNumber: string;

  @IsUUID()
  patientId: string;
}
