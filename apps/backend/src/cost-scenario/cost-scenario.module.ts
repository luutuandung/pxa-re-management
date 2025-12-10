import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CostScenarioController } from './cost-scenario.controller';
import { CostScenarioService } from './cost-scenario.service';

@Module({
  controllers: [CostScenarioController],
  providers: [CostScenarioService, PrismaService],
})
export class CostScenarioModule {}
