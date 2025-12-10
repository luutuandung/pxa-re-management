import { Injectable } from '@nestjs/common';
import { BusinessUnit } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BusinessUnitService {
  constructor(private readonly prisma: PrismaService) {}

  async getBusinessUnitList(): Promise<BusinessUnit[]> {
    return this.prisma.businessUnit.findMany();
  }
}
