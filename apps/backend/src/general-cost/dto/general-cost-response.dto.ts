import { ApiProperty } from '@nestjs/swagger';

export class GeneralCostCodeResponseDto {
  @ApiProperty({ example: 'gcc_001', description: '統一原価項目コードID' })
  generalCostCodeId: string;

  @ApiProperty({ example: 'A001', description: '統一原価項目コード' })
  generalCostCd: string;

  @ApiProperty({ example: '材料費', description: '統一原価項目名（日本語）' })
  generalCostNameJa: string;

  @ApiProperty({ example: 'Material Cost', description: '統一原価項目名（英語）' })
  generalCostNameEn: string;

  @ApiProperty({ example: '材料成本', description: '統一原価項目名（中国語）' })
  generalCostNameZh: string;

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
