import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { Insurance } from './insurance.entity';
import { InsuranceService } from './insurance.service';

@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Get()
  findAll(@Query('provider') provider?: string): Promise<Insurance[]> {
    return this.insuranceService.findAll(provider);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Insurance> {
    return this.insuranceService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInsuranceDto): Promise<Insurance> {
    return this.insuranceService.create(dto);
  }

  @Patch('id')
  update(
    @Body() dto: UpdateInsuranceDto,
    @Param('id') id: string,
  ): Promise<Insurance> {
    return this.insuranceService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.insuranceService.remove(id);
  }
}
