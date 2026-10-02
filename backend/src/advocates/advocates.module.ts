import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advocate } from './advocate.entity.js';
import { AdvocatesController } from './advocates.controller.js';
import { AdvocatesService } from './advocates.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Advocate])],
  controllers: [AdvocatesController],
  providers: [AdvocatesService],
})
export class AdvocatesModule {}
