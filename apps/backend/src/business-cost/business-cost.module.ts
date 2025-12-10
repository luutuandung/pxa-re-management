import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessCostController } from './business-cost.controller';
import { BusinessCostService } from './business-cost.service';

@Module({
  controllers: [BusinessCostController],
  providers: [BusinessCostService, PrismaService],
})
export class BusinessCostModule {}
