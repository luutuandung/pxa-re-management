import { ApiProperty } from '@nestjs/swagger';

export class CalcTypeResponseDto {
  @ApiProperty({
    description: '計算種類ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  calcTypeId: string;

  @ApiProperty({
    description: '計算種類名（日本語）',
    example: '検証',
  })
  calcTypeNameJa: string;

  @ApiProperty({
    description: '計算種類名（英語）',
    example: 'Verification',
  })
  calcTypeNameEn: string;

  @ApiProperty({
    description: '計算種類名（中国語）',
    example: '验证',
  })
  calcTypeNameZh: string;

  @ApiProperty({
    description: 'デフォルトフラグ',
    example: false,
  })
  defaultFlg: boolean;

  @ApiProperty({
    description: '削除フラグ',
    example: false,
  })
  deleteFlg: boolean;

  @ApiProperty({
    description: '作成者',
    example: 'system',
  })
  createdBy: string;

  @ApiProperty({
    description: '作成日時',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdOn: string;

  @ApiProperty({
    description: '更新者',
    example: 'system',
  })
  modifiedBy: string;

  @ApiProperty({
    description: '更新日時',
    example: '2024-01-01T00:00:00.000Z',
  })
  modifiedOn: string;

  @ApiProperty({
    description: '拠点ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  businessunitId: string;
}
