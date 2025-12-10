import type {
  GetCostRegisterListResponse,
  PatternDetailDto,
  CostRegisterListItemDto,
  PostExcelUploadErrorResponse,
  PostExcelUploadSuccessResponse,
} from '@pxa-re-management/shared';
import * as XLSX from 'xlsx';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock: Pattern details (no BU/costVersion dependency)
let mockPatternDetails: PatternDetailDto[] = [
  { costPatternDetailId: 'pd-100', costPatternDetailName: '標準A' },
  { costPatternDetailId: 'pd-200', costPatternDetailName: '大型向けB' },
];

// Mock: Items per patternDetailId
const makeItem = (
  id: string,
  type: 'G' | 'R',
  code: string,
  name: string,
  cur: 'JPY' | 'USD' | 'CNY',
  patternName: string,
  cats: { model?: string[]; dest?: string[]; secondDest?: string[] },
  value?: { startDate: string; costValue: number },
): CostRegisterListItemDto => ({
  costRegisterId: id,
  costType: type,
  costTypeLabel: type === 'G' ? '額' : 'レート',
  buCostCd: code,
  buCostNameJa: name,
  curCd: cur,
  costPatternDetailName: patternName,
  modelCategoriesText: (cats.model && cats.model.length ? cats.model.join('/') : 'なし'),
  destCategoriesText: (cats.dest && cats.dest.length ? cats.dest.join('/') : 'なし'),
  secondDestCategoriesText: (cats.secondDest && cats.secondDest.length ? cats.secondDest.join('/') : 'なし'),
  startDate: value?.startDate ?? null,
  costValue: value?.costValue ?? null,
});

let mockItemsByPattern: Record<string, CostRegisterListItemDto[]> = {
  'pd-100': [
    makeItem('cr-1001', 'G', 'MAT001', '材料費', 'JPY', '標準A', { model: ['色', 'タイプ'], dest: ['ヤマダ'], secondDest: [] }, { startDate: '202501', costValue: 120 }),
    makeItem('cr-1002', 'R', 'MAT001', '材料費', 'JPY', '標準A', { model: ['色'], dest: ['ヨドバシ'], secondDest: [] }),
    makeItem('cr-1003', 'G', 'LAB010', '工数', 'USD', '標準A', { model: [], dest: [], secondDest: [] }, { startDate: '202502', costValue: 99.5 }),
  ],
  'pd-200': [
    makeItem('cr-2001', 'G', 'MAN001', '製造費', 'CNY', '大型向けB', { model: ['タイプ'], dest: [], secondDest: ['海外'] }),
  ],
};

export async function fetchPatternDetails(): Promise<PatternDetailDto[]> {
  await wait(150);
  return mockPatternDetails;
}

export async function fetchCostRegisterList(costPatternDetailId: string): Promise<GetCostRegisterListResponse> {
  await wait(200);
  return { items: mockItemsByPattern[costPatternDetailId] ?? [] };
}

export function downloadExcelFromItems(items: CostRegisterListItemDto[]) {
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
    r.costType === 'G' ? '額' : 'レート',
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
  XLSX.writeFile(wb, 'cost_register.xlsx');
}

export async function uploadExcelAndApply(
  file: File,
  costPatternDetailId: string,
): Promise<PostExcelUploadSuccessResponse | PostExcelUploadErrorResponse> {
  // read
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(new Uint8Array(buf), { type: 'array' });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const table = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
  if (!table || table.length < 2) {
    return { success: false, errorCode: 'VALIDATION_ERROR', message: 'Excelにデータがありません' };
  }
  const header = table[0].map(String);
  const col = (name: string) => header.indexOf(name);
  const idxId = col('原価登録ID');
  const idxStart = col('適用年月');
  const idxVal = col('原価値');
  if (idxId === -1 || idxStart === -1 || idxVal === -1) {
    return { success: false, errorCode: 'VALIDATION_ERROR', message: 'ヘッダーが不正です' };
  }

  const current = mockItemsByPattern[costPatternDetailId] ?? [];
  const idSet = new Set(current.map((i) => i.costRegisterId));

  let insertedCount = 0;
  let updatedCount = 0;

  for (let i = 1; i < table.length; i++) {
    const row = table[i];
    if (!row || row.length === 0 || row.every((c) => c == null || `${c}`.trim() === '')) continue;
    const id = String(row[idxId] ?? '').trim();
    const startDate = String(row[idxStart] ?? '').trim();
    const valueRaw = row[idxVal];
    const costValue = typeof valueRaw === 'number' ? valueRaw : Number(String(valueRaw).trim());

    if (!idSet.has(id)) {
      return { success: false, errorCode: 'UNKNOWN_COST_REGISTER_ID', message: `未知のID: ${id}` };
    }
    if (!/^\d{6}$/.test(startDate)) {
      return { success: false, errorCode: 'VALIDATION_ERROR', message: `適用年月が不正: ${startDate}` };
    }
    if (!Number.isFinite(costValue)) {
      return { success: false, errorCode: 'VALIDATION_ERROR', message: `原価値が不正: ${row[idxVal]}` };
    }

    const target = current.find((c) => c.costRegisterId === id)!;
    const wasEmpty = target.startDate == null || target.costValue == null;
    target.startDate = startDate;
    target.costValue = costValue;
    if (wasEmpty) insertedCount += 1; else updatedCount += 1;
  }

  // commit back
  mockItemsByPattern[costPatternDetailId] = [...current];
  await wait(200);
  return { success: true, insertedCount, updatedCount };
}
