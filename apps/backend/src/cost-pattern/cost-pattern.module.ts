import { Module } from '@nestjs/common';
import { CostPatternController } from './cost-pattern.controller';
import { CostPatternService } from './cost-pattern.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CostPatternController],
  providers: [CostPatternService, PrismaService],
})
export class CostPatternModule {}


