// 基本的なエンティティ型
export type CalcType = {
  calcTypeId: string;
  calcTypeNameJa: string;
  calcTypeNameEn: string;
  calcTypeNameZh: string;
  defaultFlg: boolean;
  deleteFlg: boolean;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
  businessunitId: string;
};

// フォーム用の型（作成・更新用）
export type CalcTypeCreateInput = {
  calcTypeNameJa: string;
  calcTypeNameEn: string;
  calcTypeNameZh: string;
  defaultFlg?: boolean;
  businessunitId: string;
};

export type CalcTypeUpdateInput = Partial<CalcTypeCreateInput>;

// レスポンス用の型
export type CalcTypeResponse = CalcType;

// 拠点別取得用の型
export type GetCalcTypeListResponse = {
  calcTypes: CalcTypeResponse[];
};
