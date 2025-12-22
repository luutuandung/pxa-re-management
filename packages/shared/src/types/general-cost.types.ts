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

// フォーム用の型（作成・更新用）
export type GeneralCostCodeCreateInput = {
  generalCostCd: string;
  generalCostNameJa: string;
  generalCostNameEn: string;
  generalCostNameZh: string;
  deleteFlg?: boolean;
};

export type GeneralCostCodeUpdateInput = Partial<GeneralCostCodeCreateInput>;
