import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessUnitController } from './business-unit.controller';
import { BusinessUnitService } from './business-unit.service';

@Module({
  controllers: [BusinessUnitController],
  providers: [BusinessUnitService, PrismaService],
})
export class BusinessUnitModule {}
