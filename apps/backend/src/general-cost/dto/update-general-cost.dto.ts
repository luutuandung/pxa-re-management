import { ApiProperty } from '@nestjs/swagger';
import type { UpdateGeneralCostType } from '@pxa-re-management/shared';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateGeneralCostDto implements UpdateGeneralCostType {
  @ApiProperty({ example: '材料費', description: '統一原価項目名（日本語）', required: false })
  @IsString()
  @IsOptional()
  generalCostNameJa?: string;

  @ApiProperty({ example: 'Material Cost', description: '統一原価項目名（英語）', required: false })
  @IsString()
  @IsOptional()
  generalCostNameEn?: string;

  @ApiProperty({ example: '材料成本', description: '統一原価項目名（中国語）', required: false })
  @IsString()
  @IsOptional()
  generalCostNameZh?: string;

  @ApiProperty({ example: false, description: '削除フラグ', required: false })
  @IsBoolean()
  @IsOptional()
  deleteFlg?: boolean;
}
