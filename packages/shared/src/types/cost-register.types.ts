// Cost Register module shared types

export type CostType = 'G' | 'R';
export type CostTypeLabel = '額' | 'レート';
export type CurrencyCode = 'JPY' | 'USD' | 'CNY';

// Pattern details
export interface PatternDetailDto {
  costPatternDetailId: string;
  costPatternDetailName: string;
}

// List response item
export interface CostRegisterListItemDto {
  costRegisterId: string;
  costType: CostType;
  costTypeLabel: CostTypeLabel;
  buCostCd: string;
  buCostNameJa: string;
  curCd: CurrencyCode;
  costPatternDetailName: string;
  modelCategoriesText: string;
  destCategoriesText: string;
  secondDestCategoriesText: string;
  startDate: string | null;
  costValue: number | null;
}

export interface GetCostRegisterListResponse {
  items: CostRegisterListItemDto[];
}

// Excel upload responses
export type UploadErrorCode =
  | 'UNKNOWN_COST_REGISTER_ID'
  | 'VALIDATION_ERROR'
  | 'UNEXPECTED_ERROR';

export interface UploadErrorDetail {
  rowNumber: number;
  columnName: string;
  message: string;
}

export interface PostExcelUploadSuccessResponse {
  success: true;
  insertedCount: number;
  updatedCount: number;
}

export interface PostExcelUploadErrorResponse {
  success: false;
  errorCode: UploadErrorCode;
  message: string;
  details?: UploadErrorDetail[];
}
