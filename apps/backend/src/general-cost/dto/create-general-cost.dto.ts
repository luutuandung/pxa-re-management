import { ApiProperty } from '@nestjs/swagger';
import type { CreateGeneralCostType } from '@pxa-re-management/shared';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateGeneralCostDto implements CreateGeneralCostType {
  @ApiProperty({ example: 'A001', description: '統一原価項目コード' })
  @IsString()
  @IsNotEmpty()
  generalCostCd: string;

  @ApiProperty({ example: '材料費', description: '統一原価項目名（日本語）' })
  @IsString()
  @IsNotEmpty()
  generalCostNameJa: string;

  @ApiProperty({ example: 'Material Cost', description: '統一原価項目名（英語）' })
  @IsString()
  @IsNotEmpty()
  generalCostNameEn: string;

  @ApiProperty({ example: '材料成本', description: '統一原価項目名（中国語）' })
  @IsString()
  @IsNotEmpty()
  generalCostNameZh: string;

  @ApiProperty({ example: false, description: '削除フラグ', required: false })
  @IsBoolean()
  @IsOptional()
  deleteFlg?: boolean;
}

export class CreateGeneralCostArrayDto {
  @ApiProperty({ type: [CreateGeneralCostDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGeneralCostDto)
  generalCosts: CreateGeneralCostDto[];
}
