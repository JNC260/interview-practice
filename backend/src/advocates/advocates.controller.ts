import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AdvocatesService } from './advocates.service';
import { CreateAdvocateDto } from './dto/create-advocate.dto';
import { Advocate } from './advocate.entity';

@Controller('advocates')
export class AdvocatesController {
  constructor(private readonly advocatesService: AdvocatesService) {}

  @Get()
  findAll(@Query('activeOnly') activeOnly?: string): Promise<Advocate[]> {
    if (activeOnly === 'true') {
      return this.advocatesService.findActive();
    }
    return this.advocatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Advocate> {
    return this.advocatesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateAdvocateDto): Promise<Advocate> {
    return this.advocatesService.create(dto);
  }
}
