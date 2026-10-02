import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advocate } from './advocate.entity';
import { AdvocatesService } from './advocates.service';
import { AdvocatesController } from './advocates.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Advocate])],
  providers: [AdvocatesService],
  controllers: [AdvocatesController],
  exports: [AdvocatesService],
})
export class AdvocatesModule {}
