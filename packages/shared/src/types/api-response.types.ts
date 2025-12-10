// 基本的なAPIレスポンス型
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: ApiErrorResponse;
  timestamp: string;
};

// エラーレスポンス型
export type ApiErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  errorCode?: string;
  details?: any;
};
