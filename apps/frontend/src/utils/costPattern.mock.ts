import type {
  CostPatternBusinessUnit,
  CostPatternCostVersion,
  CostPatternDetail,
  CostPatternBuCostItemRow,
  CostPatternCategoryOptionsResponse,
  CreateCostPatternDetailResponse,
} from '@pxa-re-management/shared';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory mock DB
let mockBusinessUnits: CostPatternBusinessUnit[] = [
  { businessunitId: 'bu-001', buCd: 'KTN01', businessUnitNameJa: '大阪' },
  { businessunitId: 'bu-002', buCd: 'KTN02', businessUnitNameJa: '東京' },
];

let mockCostVersions: Record<string, CostPatternCostVersion[]> = {
  'bu-001': [
    { costVersionId: 'cv-001', costVersionName: '2025年4月版' },
    { costVersionId: 'cv-002', costVersionName: '2025年10月版' },
  ],
  'bu-002': [{ costVersionId: 'cv-003', costVersionName: '2025年4月版' }],
};

let mockPatternDetailsByBu: Record<string, CostPatternDetail[]> = {
  'bu-001': [
    {
      costPatternDetailId: 'pd-001',
      costPatternCd: 'A',
      costPatternName: '標準A',
      businessunitId: 'bu-001',
      costPatternModelCategories: [
        {
          costPatternModelCategoryId: 'pm-001',
          modelCategoryId: 'MOD-COLOR',
          modelCategoryName: '色',
          seq: 1,
        },
      ],
      costPatternDestCategories: [
        {
          costPatternDestCategoryId: 'pdst-001',
          destCategoryId: 'DST-YAMADA',
          destCategoryName: 'ヤマダ',
          secFlg: false,
          seq: 1,
        },
      ],
    },
  ],
  'bu-002': [],
};

let mockRowsByBuAndVersion: Record<string, CostPatternBuCostItemRow[]> = {
  'bu-001|cv-001': [
    {
      buCostItemId: 'bci-001',
      buCostCode: 'MAT001',
      buCostName: '材料費',
      costType: 'G',
      curCd: 'JPY',
      costPatternName: null,
      costPatternCd: null,
      costRegisterId: 'cr-001',
    },
    {
      buCostItemId: 'bci-001-R',
      buCostCode: 'MAT001',
      buCostName: '材料費',
      costType: 'R',
      curCd: 'JPY',
      costPatternName: '標準A',
      costPatternCd: 'A',
      costRegisterId: 'cr-002',
    },
  ],
};

export async function fetchBusinessUnits(): Promise<CostPatternBusinessUnit[]> {
  await wait(200);
  return mockBusinessUnits;
}

export async function fetchCostVersions(
  businessunitId: string,
): Promise<CostPatternCostVersion[]> {
  await wait(200);
  return mockCostVersions[businessunitId] || [];
}

export async function fetchPatternDetails(
  businessunitId: string,
): Promise<CostPatternDetail[]> {
  await wait(200);
  return mockPatternDetailsByBu[businessunitId] || [];
}

export async function fetchBuCostItems(
  businessunitId: string,
  costVersionId?: string,
): Promise<CostPatternBuCostItemRow[]> {
  await wait(200);
  if (costVersionId) {
    const key = `${businessunitId}|${costVersionId}`;
    return mockRowsByBuAndVersion[key] || [];
  }
  // costVersionId 未指定時は、該当BUの全バージョンを合算して返す
  const prefix = `${businessunitId}|`;
  const rows: CostPatternBuCostItemRow[] = [];
  Object.entries(mockRowsByBuAndVersion).forEach(([key, value]) => {
    if (key.startsWith(prefix)) rows.push(...value);
  });
  return rows;
}

export async function bulkAssignPattern(params: {
  costRegisterIds: string[];
  costPatternDetailId: string;
  businessunitId: string;
  costVersionId: string;
}): Promise<{ updated: number }> {
  await wait(200);
  const { businessunitId, costVersionId, costRegisterIds, costPatternDetailId } = params;
  const key = `${businessunitId}|${costVersionId}`;
  const rows = mockRowsByBuAndVersion[key] || [];
  const pattern = (mockPatternDetailsByBu[businessunitId] || []).find(
    (p) => p.costPatternDetailId === costPatternDetailId,
  );
  if (!pattern) return { updated: 0 };
  let updated = 0;
  for (const row of rows) {
    if (row.costRegisterId && costRegisterIds.includes(row.costRegisterId)) {
      row.costPatternCd = pattern.costPatternCd;
      row.costPatternName = pattern.costPatternName;
      updated += 1;
    }
  }
  return { updated };
}

export async function getCategoryOptions(): Promise<CostPatternCategoryOptionsResponse> {
  await wait(150);
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

export async function createPatternDetail(
  req: Omit<CostPatternDetail, 'costPatternDetailId' | 'costPatternCd' | 'costPatternModelCategories' | 'costPatternDestCategories'> & {
    costPatternModelCategories: Array<{ modelCategoryId: string; seq: number }>;
    costPatternDestCategories: Array<{ destCategoryId: string; secFlg: boolean; seq: number }>;
  },
): Promise<CreateCostPatternDetailResponse> {
  await wait(300);
  const id = `pd-${Math.random().toString(36).slice(2, 8)}`;
  const hasModel = req.costPatternModelCategories.length > 0;
  const hasSecondDest = req.costPatternDestCategories.some((d) => d.secFlg);
  const hasDest = req.costPatternDestCategories.some((d) => !d.secFlg);
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
  const modelCats = req.costPatternModelCategories.map((m, i) => ({
    costPatternModelCategoryId: `pm-${Math.random().toString(36).slice(2, 8)}`,
    modelCategoryId: m.modelCategoryId,
    modelCategoryName:
      m.modelCategoryId === 'MOD-COLOR' ? '色' : m.modelCategoryId === 'MOD-TYPE' ? 'タイプ' : m.modelCategoryId,
    seq: m.seq ?? i + 1,
  }));
  const destCats = req.costPatternDestCategories.map((d, i) => ({
    costPatternDestCategoryId: `pdst-${Math.random().toString(36).slice(2, 8)}`,
    destCategoryId: d.destCategoryId,
    destCategoryName:
      d.destCategoryId === 'DST-YAMADA'
        ? 'ヤマダ'
        : d.destCategoryId === 'DST-YODOBASHI'
          ? 'ヨドバシ'
          : d.destCategoryId,
    secFlg: d.secFlg,
    seq: d.seq ?? i + 1,
  }));
  const detail: CostPatternDetail = {
    costPatternDetailId: id,
    costPatternCd: code,
    costPatternName: req.costPatternName,
    businessunitId: req.businessunitId,
    costPatternModelCategories: modelCats,
    costPatternDestCategories: destCats,
  };
  mockPatternDetailsByBu[req.businessunitId] = [
    detail,
    ...(mockPatternDetailsByBu[req.businessunitId] || []),
  ];
  return { costPatternDetailId: id };
}


