import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import { CostScenarioController } from './cost-scenario.controller';
import { CostScenarioService } from './cost-scenario.service';

@Module({
  controllers: [CostScenarioController],
  providers: [CostScenarioService, PrismaService, AzureBlobService],
})
export class CostScenarioModule {}
