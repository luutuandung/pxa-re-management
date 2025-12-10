import { ApiProperty } from '@nestjs/swagger';
import type { DuplicateCostVersionType } from '@pxa-re-management/shared';
import { IsNotEmpty, IsString } from 'class-validator';

export class DuplicateCostVersionDto implements DuplicateCostVersionType {
  @ApiProperty({ example: 'CV_2024_001', description: 'コピー元の原価バージョンID' })
  @IsString()
  @IsNotEmpty()
  sourceCostVersionId: string;

  @ApiProperty({ example: 'CV_2025_001', description: '新しい原価バージョンID' })
  @IsString()
  @IsNotEmpty()
  newCostVersionId: string;

  @ApiProperty({ example: '2025年度原価', description: '新しい原価バージョン名' })
  @IsString()
  @IsNotEmpty()
  newCostVersionName: string;

  @ApiProperty({ example: 'KTN001', description: '系統コード' })
  @IsString()
  @IsNotEmpty()
  ktnCd: string;
}