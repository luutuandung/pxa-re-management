import { ApiProperty } from '@nestjs/swagger';
import type { CreateCostVersionType } from '@pxa-re-management/shared';
import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCostVersionDto implements CreateCostVersionType {
  @ApiProperty({ example: 'CV_2024_001', description: '原価バージョンID' })
  @IsString()
  @IsNotEmpty()
  costVersionId: string;

  @ApiProperty({ example: 'KTN001', description: '系統コード' })
  @IsString()
  @IsNotEmpty()
  businessunitId: string;

  @ApiProperty({ example: '2024年度原価', description: '原価バージョン名' })
  @IsString()
  @IsNotEmpty()
  costVersionName: string;

  @ApiProperty({ example: '202404', description: '開始日（YYYYMM形式）' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: '日付はYYYYMM形式で入力してください' })
  startDate: string;

  @ApiProperty({ example: '202503', description: '終了日（YYYYMM形式）' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: '日付はYYYYMM形式で入力してください' })
  endDate: string;

  @ApiProperty({ example: '2024年度の原価バージョンです', description: '説明' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: false, description: 'デフォルトフラグ' })
  @IsBoolean()
  defaultFlg: boolean;
}