export type CreateCostVersionType = {
  businessunitId: string;
  costVersionName: string;
  startDate: string; // YYYYMM形式 (例: 202404)
  endDate: string; // YYYYMM形式 (例: 202503)
  description: string;
  defaultFlg: boolean;
};

export type UpdateCostVersionType = Partial<{
  ktnCd: string;
  costVersionName: string;
  startDate: string; // YYYYMM形式 (例: 202404)
  endDate: string; // YYYYMM形式 (例: 202503)
  description: string;
  defaultFlg: boolean;
}>;

export type DuplicateCostVersionType = {
  sourceCostVersionId: string;
  newCostVersionId?: string;
  newCostVersionName: string;
  ktnCd: string;
};