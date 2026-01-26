export type CostItemsBuCostCode = {
  buCostCodeId: string;
  buCostCd: string;
  buCostNameJa: string;
  buCostNameEn: string;
  buCostNameZh: string;
};

export type CostItemsBuCostItem = {
  buCostItemId: string;
  buCostCodeId: string;
  costType: 'G' | 'R' | 'K';
};

export interface GetCostItemsResponse {
  buCostCodes: CostItemsBuCostCode[];
  buCostItems: CostItemsBuCostItem[];
}
