import { Module } from '@nestjs/common';
import { GeneralCostController } from './general-cost.controller';
import { GeneralCostService } from './general-cost.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GeneralCostController],
  providers: [GeneralCostService, PrismaService],
})
export class GeneralCostModule {}
