import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CalcTypeController } from './calc-type.controller';
import { CalcTypeService } from './calc-type.service';

@Module({
  controllers: [CalcTypeController],
  providers: [CalcTypeService],
  imports: [PrismaModule],
  exports: [CalcTypeService],
})
export class CalcTypeModule {}
