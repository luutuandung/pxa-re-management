import { ApiProperty } from '@nestjs/swagger';
import type { UpdateCostVersionType } from '@pxa-re-management/shared';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateCostVersionDto implements UpdateCostVersionType {
  @ApiProperty({ example: 'KTN001', description: '系統コード', required: false })
  @IsOptional()
  @IsString()
  ktnCd?: string;

  @ApiProperty({ example: '2024年度原価', description: '原価バージョン名', required: false })
  @IsOptional()
  @IsString()
  costVersionName?: string;

  @ApiProperty({ example: '202404', description: '開始日（YYYYMM形式）', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: '日付はYYYYMM形式で入力してください' })
  startDate?: string;

  @ApiProperty({ example: '202503', description: '終了日（YYYYMM形式）', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: '日付はYYYYMM形式で入力してください' })
  endDate?: string;

  @ApiProperty({ example: '2024年度の原価バージョンです', description: '説明', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: false, description: 'デフォルトフラグ', required: false })
  @IsOptional()
  @IsBoolean()
  defaultFlg?: boolean;
}