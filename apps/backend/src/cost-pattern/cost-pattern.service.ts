import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CostPatternService {
  constructor(private readonly prisma: PrismaService) {}

  async getBusinessUnits() {
    const units = await this.prisma.businessUnit.findMany({
      select: { businessunitId: true, buCd: true, businessunitNameJa: true },
      orderBy: { buCd: 'asc' },
    });
    return units.map((u) => ({ businessunitId: u.businessunitId, buCd: u.buCd, businessUnitNameJa: u.businessunitNameJa }));
  }

  async getCostVersions(businessunitId: string) {
    const versions = await this.prisma.costVersion.findMany({
      where: { businessunitId },
      select: { costVersionId: true, costVersionName: true },
      orderBy: { costVersionName: 'asc' },
    });
    return versions;
  }

  async getPatternDetails() {
    const details = await this.prisma.costPatternDetail.findMany({
      include: {
        costPatternModelCategories: true,
        costPatternDestCategories: true,
      },
      orderBy: { costPatternName: 'asc' },
    });
    return details.map((d) => ({
      costPatternDetailId: d.costPatternDetailId,
      costPatternCd: d.costPatternCd,
      costPatternName: d.costPatternName,
      costPatternModelCategories: d.costPatternModelCategories.map((m) => ({
        costPatternModelCategoryId: m.modelCategoryId,
        modelCategoryId: m.modelCategoryId,
        modelCategoryName: m.modelCategoryId,
        seq: m.seq,
      })),
      costPatternDestCategories: d.costPatternDestCategories.map((c) => ({
        costPatternDestCategoryId: c.destCategoryId,
        destCategoryId: c.destCategoryId,
        destCategoryName: c.destCategoryId,
        secFlg: c.secFlg,
        seq: c.seq,
      })),
    }));
  }

  async getBuCostItems(businessunitId: string, costVersionId?: string) {
    // buCostItem 基点で costRegisters LEFT JOIN。必要に応じて costVersionId で絞り込み
    const items = await this.prisma.buCostItem.findMany({
      where: { businessunitId },
      include: {
        buCostCode: true,
        costRegisters: {
          where: costVersionId ? { costVersionId } : {},
          include: { costPatternDetail: true },
        },
      },
      orderBy: { buCostCodeId: 'asc' },
    });

    const rows: any[] = [];
    for (const it of items) {
      // 原価種類ごとの行生成: amountValidFlg -> 'G', rateValidFlg -> 'R'
      const candidates: ('G' | 'R')[] = [];
      if (it.amountValidFlg) candidates.push('G');
      if (it.rateValidFlg) candidates.push('R');
      for (const kind of candidates) {
        const reg = it.costRegisters.find((r) => r.costType === kind);
        rows.push({
          buCostItemId: it.buCostItemId,
          buCostCode: it.buCostCode.buCostCd,
          buCostName: it.buCostCode.buCostNameJa,
          costType: kind,
          curCd: it.curCd as 'JPY' | 'USD' | 'CNY',
          costPatternName: reg?.costPatternDetail?.costPatternName ?? null,
          costPatternCd: (reg?.costPatternDetail?.costPatternCd as any) ?? null,
          costRegisterId: reg?.costRegisterId ?? null,
        });
      }
    }
    return rows;
  }

  async bulkAssign(body: { costRegisterIds: string[]; costPatternDetailId: string }) {
    if (!body.costRegisterIds || body.costRegisterIds.length === 0) return { updated: 0 };
    const res = await this.prisma.costRegister.updateMany({
      where: { costRegisterId: { in: body.costRegisterIds } },
      data: { costPatternDetailId: body.costPatternDetailId, modifiedBy: 'system' },
    });
    return { updated: res.count };
  }

  // マスタ未定義のためモック返却
  getCategoryOptions() {
    return {
      modelCategories: [
        { modelCategoryId: 'MOD-COLOR', modelCategoryName: '色' },
        { modelCategoryId: 'MOD-TYPE', modelCategoryName: 'タイプ' },
      ],
      destCategories: [
        { destCategoryId: 'DST-YAMADA', destCategoryName: 'ヤマダ' },
        { destCategoryId: 'DST-YODOBASHI', destCategoryName: 'ヨドバシ' },
      ],
    };
  }

  async createPatternDetail(body: {
    costPatternName: string;
    costPatternModelCategories: { modelCategoryId: string; seq: number }[];
    costPatternDestCategories: { destCategoryId: string; secFlg: boolean; seq: number }[];
  }) {
    const hasModel = body.costPatternModelCategories.length > 0;
    const hasSecondDest = body.costPatternDestCategories.some((d) => d.secFlg);
    const hasDest = body.costPatternDestCategories.some((d) => !d.secFlg);
    const code = hasModel && !hasSecondDest && !hasDest
      ? 'A'
      : !hasModel && hasSecondDest && !hasDest
        ? 'B'
        : !hasModel && !hasSecondDest && hasDest
          ? 'C'
          : hasModel && hasSecondDest && !hasDest
            ? 'D'
            : hasModel && !hasSecondDest && hasDest
              ? 'E'
              : !hasModel && hasSecondDest && hasDest
                ? 'F'
                : hasModel && hasSecondDest && hasDest
                  ? 'G'
                  : 'A';

    const result = await this.prisma.$transaction(async (tx) => {
      const newId = randomUUID();
      const detail = await tx.costPatternDetail.create({
        data: {
          costPatternDetailId: newId,
          costPatternCd: code,
          costPatternName: body.costPatternName,
        },
      });

      if (body.costPatternModelCategories?.length) {
        await tx.costPatternModelCategory.createMany({
          data: body.costPatternModelCategories.map((m) => ({
            costPatternDetailId: detail.costPatternDetailId,
            modelCategoryId: m.modelCategoryId,
            seq: m.seq,
          })),
        });
      }
      if (body.costPatternDestCategories?.length) {
        await tx.costPatternDestCategory.createMany({
          data: body.costPatternDestCategories.map((d) => ({
            costPatternDetailId: detail.costPatternDetailId,
            destCategoryId: d.destCategoryId,
            secFlg: d.secFlg,
            seq: d.seq,
          })),
        });
      }
      return detail;
    });

    return { costPatternDetailId: result.costPatternDetailId };
  }
}


