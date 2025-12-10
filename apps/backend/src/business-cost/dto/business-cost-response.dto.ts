import { ApiProperty } from '@nestjs/swagger';

export class BusinessCostResponseDto {
  @ApiProperty({ example: 'bc_001', description: '事業部原価項目コードID' })
  buCostCodeId: string;

  @ApiProperty({ example: 'KTN001', description: 'KTNコード' })
  buCd: string;

  @ApiProperty({ example: 'A001', description: '統一原価項目コード' })
  generalCostCd: string;

  @ApiProperty({ example: 'BC001', description: '事業部原価項目コード' })
  buCostCd: string;

  @ApiProperty({ example: '材料費', description: '事業部原価項目名（日本語）' })
  buCostNameJa: string;

  @ApiProperty({ example: 'Material Cost', description: '事業部原価項目名（英語）' })
  buCostNameEn: string;

  @ApiProperty({ example: '材料成本', description: '事業部原価項目名（中国語）' })
  buCostNameZh: string;

  @ApiProperty({ example: false, description: '削除フラグ' })
  deleteFlg: boolean;

  @ApiProperty({ example: 'user_001', description: '作成者' })
  createdBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '作成日時' })
  createdOn: Date;

  @ApiProperty({ example: 'user_001', description: '更新者' })
  modifiedBy: string;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: '更新日時' })
  modifiedOn: Date;
}
