import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  GetCostRegisterListResponse,
  PatternDetailDto,
  PostExcelUploadErrorResponse,
  PostExcelUploadSuccessResponse,
} from '@pxa-re-management/shared';
import * as XLSX from 'xlsx';

@Injectable()
export class CostRegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async getPatternDetails(): Promise<PatternDetailDto[]> {
    const details = await this.prisma.costPatternDetail.findMany({
      select: { costPatternDetailId: true, costPatternName: true },
      orderBy: { costPatternName: 'asc' },
    });
    return details.map((d) => ({ costPatternDetailId: d.costPatternDetailId, costPatternDetailName: d.costPatternName }));
  }

  async getList(costPatternDetailId: string): Promise<GetCostRegisterListResponse> {
    if (!costPatternDetailId) throw new BadRequestException('costPatternDetailId is required');

    const regs = await this.prisma.costRegister.findMany({
      where: { costPatternDetailId },
      include: {
        buCostItem: { include: { buCostCode: true } },
        costPatternDetail: { include: { costPatternModelCategories: true, costPatternDestCategories: true } },
        costRegisterValues: true,
      },
      orderBy: { buCostItemId: 'asc' },
    });

    // Resolve only sales category names from SalesCategory; model category names fallback to ID（仕様に従い、名称テーブルが未統合のため）
    const destIds = Array.from(
      new Set(regs.flatMap((r) => r.costPatternDetail?.costPatternDestCategories?.map((d) => d.destCategoryId) ?? [])),
    ).filter(Boolean) as string[];

    const salesCats = destIds.length
      ? await this.prisma.salesCategory.findMany({
          where: { salesCategoryId: { in: destIds } },
          select: { salesCategoryId: true, salesCategoryNameJa: true },
        })
      : [];
    const salesNameById = new Map(salesCats.map((c) => [c.salesCategoryId, c.salesCategoryNameJa] as const));

    const items = regs.map((r) => {
      const detail = r.costPatternDetail;
      const modelNames = (detail?.costPatternModelCategories ?? [])
        .map((m) => m.modelCategoryId) // 名称はマスタ未統合のためIDを表示
        .filter((s) => !!s);
      const destNames = (detail?.costPatternDestCategories ?? [])
        .filter((d) => !d.secFlg)
        .map((d) => salesNameById.get(d.destCategoryId) ?? d.destCategoryId)
        .filter((s) => !!s);
      const secondDestNames = (detail?.costPatternDestCategories ?? [])
        .filter((d) => d.secFlg)
        .map((d) => salesNameById.get(d.destCategoryId) ?? d.destCategoryId)
        .filter((s) => !!s);

      const v = r.costRegisterValues[0] ?? null; // schema上PK=costRegisterIdの単一行
      const costType = r.costType as 'G' | 'R';
      const costTypeLabel = costType === 'G' ? '額' as const : 'レート' as const;

      return {
        costRegisterId: r.costRegisterId,
        costType,
        costTypeLabel,
        buCostCd: r.buCostItem.buCostCode.buCostCd,
        buCostNameJa: r.buCostItem.buCostCode.buCostNameJa,
        curCd: r.buCostItem.curCd as 'JPY' | 'USD' | 'CNY',
        costPatternDetailName: detail?.costPatternName ?? '',
        modelCategoriesText: modelNames.length ? modelNames.join('/') : 'なし',
        destCategoriesText: destNames.length ? destNames.join('/') : 'なし',
        secondDestCategoriesText: secondDestNames.length ? secondDestNames.join('/') : 'なし',
        startDate: v?.startDate ?? null,
        costValue: (v?.costValue ?? null) as number | null,
      };
    });

    return { items };
  }

  async generateExcelBuffer(costPatternDetailId: string): Promise<Buffer> {
    const { items } = await this.getList(costPatternDetailId);
    const headers = [
      '原価登録ID',
      '事業部原価項目コード',
      '事業原価項目名',
      '原価種類',
      '通貨',
      'パターン明細名',
      '機種カテゴリ',
      '販売先カテゴリ',
      '2次販売先カテゴリ',
      '適用年月',
      '原価値',
      '削除フラグ',
    ];
    const rows = items.map((r) => [
      r.costRegisterId,
      r.buCostCd,
      r.buCostNameJa,
      r.costTypeLabel,
      r.curCd,
      r.costPatternDetailName,
      r.modelCategoriesText,
      r.destCategoriesText,
      r.secondDestCategoriesText,
      r.startDate ?? '',
      r.costValue ?? '',
      0,
    ]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, '原価登録');
    const out = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return out as Buffer;
  }

  async upload(fileBuffer: Buffer, costPatternDetailId: string): Promise<PostExcelUploadSuccessResponse | PostExcelUploadErrorResponse> {
    if (!fileBuffer || !costPatternDetailId) throw new BadRequestException('invalid request');

    // parse workbook
    const wb = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    if (!sheet) throw new BadRequestException('Excel sheet not found');
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    if (!rows || rows.length < 2) throw new BadRequestException('Excel has no data');

    const header = rows[0].map(String);
    const indexOf = (name: string) => header.indexOf(name);
    const idxId = indexOf('原価登録ID');
    const idxStart = indexOf('適用年月');
    const idxVal = indexOf('原価値');
    if (idxId === -1 || idxStart === -1 || idxVal === -1) {
      throw new BadRequestException('Invalid header');
    }

    // collect entries
    const entries: { id: string; startDate: string; costValue: number }[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0 || row.every((c) => c == null || (typeof c === 'string' && c.trim() === ''))) continue;
      const id = String(row[idxId] ?? '').trim();
      const startDate = String(row[idxStart] ?? '').trim();
      const valueRaw = row[idxVal];
      const costValue = typeof valueRaw === 'number' ? valueRaw : Number(String(valueRaw).trim());
      if (!id) throw new BadRequestException(`Missing costRegisterId at row ${i + 1}`);
      if (!/^\d{6}$/.test(startDate)) throw new BadRequestException(`Invalid startDate at row ${i + 1}`);
      if (!Number.isFinite(costValue)) throw new BadRequestException(`Invalid costValue at row ${i + 1}`);
      entries.push({ id, startDate, costValue });
    }

    return await this.applyEntries(entries, costPatternDetailId);
  }

  private async applyEntries(
    entries: { id: string; startDate: string; costValue: number }[],
    costPatternDetailId: string,
  ): Promise<PostExcelUploadSuccessResponse | PostExcelUploadErrorResponse> {
    return await this.prisma.$transaction(async (tx) => {
      // validate ids
      const ids = Array.from(new Set(entries.map((e) => e.id)));
      const regs = await tx.costRegister.findMany({ where: { costRegisterId: { in: ids } }, select: { costRegisterId: true, costPatternDetailId: true } });
      const ok = new Set(regs.filter((r) => r.costPatternDetailId === costPatternDetailId).map((r) => r.costRegisterId));
      for (const id of ids) {
        if (!ok.has(id)) {
          throw new BadRequestException(`UNKNOWN_COST_REGISTER_ID: ${id}`);
        }
      }

      let insertedCount = 0;
      let updatedCount = 0;
      for (const e of entries) {
        const existing = await tx.costRegisterValue.findUnique({ where: { costRegisterId: e.id } });
        if (existing) {
          await tx.costRegisterValue.update({ where: { costRegisterId: e.id }, data: { startDate: e.startDate, costValue: e.costValue } });
          updatedCount += 1;
        } else {
          await tx.costRegisterValue.create({ data: { costRegisterId: e.id, startDate: e.startDate, costValue: e.costValue } });
          insertedCount += 1;
        }
      }
      return { success: true, insertedCount, updatedCount } as PostExcelUploadSuccessResponse;
    });
  }
}
