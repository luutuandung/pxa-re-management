// Cost Pattern module shared types

export type CostPatternBusinessUnit = {
  businessunitId: string;
  buCd: string;
  businessUnitNameJa: string;
};

export type CostPatternCostVersion = {
  costVersionId: string;
  costVersionName: string;
};

export type CostPatternModelCategoryItem = {
  costPatternModelCategoryId: string;
  modelCategoryId: string;
  modelCategoryName: string;
  seq: number;
};

export type CostPatternDestCategoryItem = {
  costPatternDestCategoryId: string;
  destCategoryId: string;
  destCategoryName: string;
  secFlg: boolean;
  seq: number;
};

export type CostPatternDetail = {
  costPatternDetailId: string;
  costPatternCd: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  costPatternName: string;
  businessunitId: string;
  costPatternModelCategories: CostPatternModelCategoryItem[];
  costPatternDestCategories: CostPatternDestCategoryItem[];
};

export type CostPatternBuCostItemRow = {
  buCostItemId: string;
  buCostCode: string;
  buCostName: string;
  costType: 'G' | 'R';
  curCd: 'JPY' | 'USD' | 'CNY';
  costPatternName: string | null;
  costPatternCd: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null;
  costRegisterId: string | null;
};

export type CostPatternCategoryOptionsResponse = {
  modelCategories: Array<{
    modelCategoryId: string;
    modelCategoryName: string;
  }>;
  destCategories: Array<{
    destCategoryId: string;
    destCategoryName: string;
  }>;
};

export type CreateCostPatternDetailResponse = {
  costPatternDetailId: string;
};


