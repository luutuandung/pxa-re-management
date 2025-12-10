// Cost Register module request types

export type GetCostRegisterListRequest = {
  costPatternDetailId: string;
};

export type GetExcelRequest = {
  costPatternDetailId: string;
};

export interface PostExcelUploadRequest {
  costPatternDetailId: string;
  // file is handled by framework-specific decorators/types
}
