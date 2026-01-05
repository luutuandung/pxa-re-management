import type { CalcDisplay, CalcFormula } from './calculation.types';

export interface BuCostItem {
  buCostItemId: string;
  buCostCodeId: string;
  curCd: string;
  amountValidFlg: boolean;
  rateValidFlg: boolean;
  calcValidFlg: boolean;
  autoCreateValidFlg: boolean;
  // calcDisplays: CalcDisplay[];
}

export type BuCostItemWithCalcDisplay =
    BuCostItem &
    { calcDisplay?: CalcDisplay & { calcFormulas: Array<CalcFormula>; };
}




// 保存・更新用の型定義
export type NewBusinessCostItemRequestData = {
  buCostCodeId: string;
  startDate: string;
  endDate: string;
  curCd: string;
  amountValidFlg: boolean;
  rateValidFlg: boolean;
  calcValidFlg: boolean;
  autoCreateValidFlg: boolean;
};

export type UpdatedBusinessCostItemRequestData = {
  buCostItemId: string;
  startDate?: string;
  endDate?: string;
  curCd?: string;
  amountValidFlg?: boolean;
  rateValidFlg?: boolean;
  calcValidFlg?: boolean;
  autoCreateValidFlg?: boolean;
};

export type BusinessCostItemBulkSaveRequest = {
  newItems: NewBusinessCostItemRequestData[];
  updates: UpdatedBusinessCostItemRequestData[];
};
