import { Injectable } from '@nestjs/common';
import { BusinessUnit, CostVersion, RateExchange, ScenarioBusiness } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CostScenarioService {
  constructor(private readonly prisma: PrismaService) {}

  async getBusinessUnits(): Promise<BusinessUnit[]> {
    return this.prisma.businessUnit.findMany();
  }

  async getCostVersions(): Promise<CostVersion[]> {
    return this.prisma.costVersion.findMany({ where: { deleteFlg: false } });
  }

  async getRateExchanges(): Promise<{ rateType: number }[]> {
    return this.prisma.rateExchange.findMany({ select: { rateType: true } });
  }

  async getScenarioDetails(): Promise<{ salesVersionName: string }[]> {
    return this.prisma.scenarioDetail.findMany({ select: { salesVersionName: true } });
  }

  async getConcatTargets(params: {
    axisBuCd: string;
    mode: 'parent' | 'child';
  }): Promise<{ parentBu: BusinessUnit | null; childBu: BusinessUnit | null; aggConcatId: string }[]> {
    const { axisBuCd, mode } = params;
    const aggConcats = await this.prisma.aggConcat.findMany({
      where: mode === 'parent' ? { childBuCd: axisBuCd } : { parentBuCd: axisBuCd },
    });

    const withBusinessUnits = await Promise.all(
      aggConcats.map(async (aggConcat) => ({
        aggConcatId: aggConcat.aggConcatId,
        parentBu: await this.prisma.businessUnit.findFirst({ where: { buCd: aggConcat.parentBuCd } }),
        childBu: await this.prisma.businessUnit.findFirst({ where: { buCd: aggConcat.childBuCd } }),
      }))
    );
    return withBusinessUnits;
  }

  async getBusinessUnitByBuCd(buCd: string): Promise<BusinessUnit | null> {
    return this.prisma.businessUnit.findFirst({ where: { buCd } });
  }

  async getScenarioBusinessesByBusinessUnitId(businessunitId: string): Promise<ScenarioBusiness[]> {
    return this.prisma.scenarioBusiness.findMany({ where: { businessunitId } });
  }

  async getCostVersionsByBusinessUnitId(businessunitId: string): Promise<CostVersion[]> {
    return this.prisma.costVersion.findMany({ where: { businessunitId, deleteFlg: false } });
  }

  async getRateTypes(): Promise<RateExchange[]> {
    return this.prisma.rateExchange.findMany();
  }

  async getCurrencies(): Promise<{ afterCurCd: string }[]> {
    return this.prisma.rateExchange.findMany({ select: { afterCurCd: true } });
  }

  async getScenarioTypes(): Promise<{ scenarioTypeId: string; scenarioTypeName: string }[]> {
    return this.prisma.scenarioType.findMany({
      select: {
        scenarioTypeId: true,
        scenarioTypeName: true,
      },
      orderBy: {
        scenarioTypeName: 'asc',
      },
    });
  }
}
