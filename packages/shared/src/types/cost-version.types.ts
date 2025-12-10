export type CostVersion = {
  costVersionId: string;
  costVersionName: string;
  startDate: string; // YYYYMM形式 (例: 202404)
  endDate: string; // YYYYMM形式 (例: 202503)
  description: string;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
  businessunitId: string;
};