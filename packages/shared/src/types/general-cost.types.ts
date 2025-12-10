// 基本的なエンティティ型（新しいスキーマ構造に対応）
export type GeneralCostCode = {
  generalCostCodeId: string;
  generalCostCd: string;
  generalCostNameJa: string;
  generalCostNameEn: string;
  generalCostNameZh: string;
  deleteFlg: boolean;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
};

// LanguageMasterは他のテーブル（CostType等）で使用されているため残す
export type LanguageMaster = {
  languageMasterId: string;
  languageCd: string;
  languageName: string;
};

// フォーム用の型（作成・更新用）
export type GeneralCostCodeCreateInput = {
  generalCostCd: string;
  generalCostNameJa: string;
  generalCostNameEn: string;
  generalCostNameZh: string;
  deleteFlg?: boolean;
};

export type GeneralCostCodeUpdateInput = Partial<GeneralCostCodeCreateInput>;

// レスポンス用の型（GeneralCostCodeと同じだが、明示的に分離）
export type GeneralCostCodeResponse = GeneralCostCode;

// 一括作成用の型
export type GeneralCostCodeBulkCreateInput = {
  generalCosts: GeneralCostCodeCreateInput[];
};
