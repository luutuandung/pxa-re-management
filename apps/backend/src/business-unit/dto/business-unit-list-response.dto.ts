import { ApiProperty } from '@nestjs/swagger';

export class BusinessUnitItemDto {
  @ApiProperty({
    description: 'ビジネスユニットID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  businessunitId: string;

  @ApiProperty({
    description: 'KTNコード',
    example: 'KTN001',
  })
  buCd: string;

  @ApiProperty({
    description: 'ビジネスユニット名',
    example: 'ビジネスユニット名',
  })
  name: string;

  @ApiProperty({
    description: '基本通貨名',
    example: 'JPY',
  })
  baseCurrencyName: string;

  @ApiProperty({
    description: 'ビジネスユニット名（日本語）',
    example: 'ビジネスユニット名（日本語）',
  })
  businessunitNameJa: string;

  @ApiProperty({
    description: '製品名（日本語）',
    example: '製品名（日本語）',
  })
  productNameJa: string;

  @ApiProperty({
    description: 'ビジネスユニット名（英語）',
    example: 'Business Unit Name (English)',
  })
  businessunitNameEn: string;

  @ApiProperty({
    description: '製品名（英語）',
    example: 'Product Name (English)',
  })
  productNameEn: string;

  @ApiProperty({
    description: 'ビジネスユニット名（中国語）',
    example: 'ビジネスユニット名（中国語）',
  })
  businessunitNameZh: string;

  @ApiProperty({
    description: '製品名（中国語）',
    example: '製品名（中国語）',
  })
  productNameZh: string;

  @ApiProperty({
    description: '作成者ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  createdBy: string;

  @ApiProperty({
    description: '作成日時',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdOn: string;

  @ApiProperty({
    description: '更新者ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  modifiedBy: string;

  @ApiProperty({
    description: '更新日時',
    example: '2024-01-01T00:00:00.000Z',
  })
  modifiedOn: string;
}

export class BusinessUnitListResponseDto {
  @ApiProperty({
    description: 'ビジネスユニット一覧',
    type: [BusinessUnitItemDto],
  })
  businessUnits: BusinessUnitItemDto[];
}
