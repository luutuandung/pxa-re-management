import type { BuCostItem, BuCostItemWithCalcDisplay } from './business-cost-item.types';
import type { GeneralCostCode } from './general-cost.types';

export interface BusinessCostResponse {
  buCostCodeId: string;
  businessunitId: string;
  generalCostCd: string | null;
  buCostCd: string;
  buCostNameJa: string;
  buCostNameEn: string;
  buCostNameZh: string;
  deleteFlg: boolean;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
}

export interface BusinessCostWithNamesResponse {
  buCostCodeId: string;
  businessunitId: string;
  generalCostCd: string | null;
  buCostCd: string;
  buCostNameJa: string;
  buCostNameEn: string;
  buCostNameZh: string;
  deleteFlg: boolean;
  generalCostCode: GeneralCostCode | null;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
}

export interface BusinessCostWithNamesForCalculationResponse {
  buCostCodeId: string;
  businessunitId: string;
  generalCostCd: string | null;
  buCostCd: string;
  buCostNameJa: string;
  buCostNameEn: string;
  buCostNameZh: string;
  deleteFlg: boolean;
  generalCostCode: GeneralCostCode | null;
  buCostItems: BuCostItem[] | null;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
}

/** @description 【 日本語名 】 計算式登録画面用 */
export type BusinessCostWithCalcDisplay =
    BuCostCode &
    { buCostItem: BuCostItemWithCalcDisplay }

// 保存用のデータ型定義（新しいスキーマ構造）
export interface BusinessCostItemSaveData {
  buCostCodeId?: string; // 既存データの場合はID、新規の場合はundefined
  businessunitId: string;
  generalCostCd: string | null;
  buCostCd: string;
  buCostNameJa: string;
  buCostNameEn: string;
  buCostNameZh: string;
  deleteFlg?: boolean;
}

// 保存リクエストの型定義
export interface BusinessCostSaveRequest {
  businessCostItems: BusinessCostItemSaveData[];
}

export type BuCostCode = {
  buCostCodeId: string;
  businessunitId: string;
  generalCostCd: string | null;
  buCostCd: string;
  buCostNameJa: string;
  buCostNameEn: string;
  buCostNameZh: string;
  deleteFlg: boolean;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
};

// フォーム用の型
export type BuCostCodeCreateInput = {
  businessunitId: string;
  generalCostCd: string | null;
  buCostCd: string;
  buCostNameJa: string;
  buCostNameEn: string;
  buCostNameZh: string;
  deleteFlg?: boolean;
};

export type BuCostCodeUpdateInput = Partial<BuCostCodeCreateInput> & {
  buCostCodeId: string;
};

// レスポンス用の型
export type BuCostCodeResponse = BuCostCode;
