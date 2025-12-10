// General Cost関連のリクエスト型定義（新しいスキーマ構造に対応）
// バリデーションが必要な場合は、各アプリケーション側でclass-validatorを使用

export type CreateGeneralCostType = {
  generalCostCd: string;
  generalCostNameJa: string;
  generalCostNameEn: string;
  generalCostNameZh: string;
  deleteFlg?: boolean;
};

export type UpdateGeneralCostType = {
  generalCostNameJa?: string;
  generalCostNameEn?: string;
  generalCostNameZh?: string;
  deleteFlg?: boolean;
};

// 一括作成用の型
export type BulkCreateGeneralCostType = {
  generalCosts: CreateGeneralCostType[];
};
