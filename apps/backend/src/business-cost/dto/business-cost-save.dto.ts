import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

export class BusinessCostItemSaveDto {
  @ApiProperty({ example: 'bc_001', description: '事業部原価項目コードID（更新時）', required: false })
  @IsString()
  @IsOptional()
  buCostCodeId?: string;

  @ApiProperty({ example: 'BU001', description: '事業部コード' })
  @IsString()
  @IsNotEmpty()
  businessunitId: string;

  @ApiProperty({ example: 'A001', description: '統一原価項目コード' })
  @IsString()
  @IsNotEmpty()
  generalCostCd: string;

  @ApiProperty({ example: 'BC001', description: '事業部原価項目コード' })
  @IsString()
  @IsNotEmpty()
  buCostCd: string;

  @ApiProperty({ example: '材料費', description: '事業部原価項目名（日本語）' })
  @IsString()
  @IsNotEmpty()
  buCostNameJa: string;

  @ApiProperty({ example: 'Material Cost', description: '事業部原価項目名（英語）' })
  @IsString()
  @IsNotEmpty()
  buCostNameEn: string;

  @ApiProperty({ example: '材料成本', description: '事業部原価項目名（中国語）' })
  @IsString()
  @IsNotEmpty()
  buCostNameZh: string;

  @ApiProperty({ example: false, description: '削除フラグ', required: false })
  @IsBoolean()
  @IsOptional()
  deleteFlg?: boolean;
}

export class BusinessCostSaveRequestDto {
  @ApiProperty({ type: [BusinessCostItemSaveDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessCostItemSaveDto)
  businessCostItems: BusinessCostItemSaveDto[];
}
