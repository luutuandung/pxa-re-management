import { Module } from '@nestjs/common';
import { CostRegisterController } from './cost-register.controller';
import { CostRegisterService } from './cost-register.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CostRegisterController],
  providers: [CostRegisterService, PrismaService],
  exports: [CostRegisterService],
})
export class CostRegisterModule {}
