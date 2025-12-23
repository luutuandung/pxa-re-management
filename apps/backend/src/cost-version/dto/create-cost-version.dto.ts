import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCostVersionDto {
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