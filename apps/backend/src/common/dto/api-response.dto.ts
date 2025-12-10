import { ApiProperty } from '@nestjs/swagger';

export class ApiErrorResponseDto {
  @ApiProperty({ example: 400, description: 'HTTPステータスコード' })
  statusCode: number;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'エラー発生時刻' })
  timestamp: string;

  @ApiProperty({ example: '/api/general-cost', description: 'リクエストパス' })
  path: string;

  @ApiProperty({ example: 'GET', description: 'HTTPメソッド' })
  method: string;

  @ApiProperty({ example: 'Validation failed', description: 'エラーメッセージ' })
  message: string;

  @ApiProperty({ example: 'VALIDATION_ERROR', description: 'エラーコード', required: false })
  errorCode?: string;

  @ApiProperty({ description: 'エラー詳細情報', required: false })
  details?: any;
}

export class BaseApiResponseDto<T = any> {
  @ApiProperty({ example: true, description: '成功フラグ' })
  success: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'レスポンス時刻' })
  timestamp: string;

  @ApiProperty({ description: 'レスポンスデータ', required: false })
  data?: T;

  @ApiProperty({ type: ApiErrorResponseDto, description: 'エラー情報', required: false })
  error?: ApiErrorResponseDto;
}

export class SuccessResponseDto<T = any> extends BaseApiResponseDto<T> {
  @ApiProperty({ example: true, description: '成功フラグ' })
  declare success: true;

  @ApiProperty({ description: 'レスポンスデータ' })
  declare data: T;
}

export class DeleteSuccessResponseDto {
  @ApiProperty({ example: true, description: '成功フラグ' })
  success: boolean;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'レスポンス時刻' })
  timestamp: string;

  @ApiProperty({ example: '削除が完了しました', description: 'メッセージ' })
  message: string;
}
