import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CostVersionController } from './cost-version.controller';
import { CostVersionService } from './cost-version.service';

@Module({
  controllers: [CostVersionController],
  providers: [CostVersionService, PrismaService],
})
export class CostVersionModule {}
