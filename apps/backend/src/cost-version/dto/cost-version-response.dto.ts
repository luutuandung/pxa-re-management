import { ApiProperty } from '@nestjs/swagger';

export class CostVersionResponseDto {
  @ApiProperty({ example: 'CV_2024_001', description: '原価バージョンID' })
  costVersionId: string;

  @ApiProperty({ example: '2024年度原価', description: '原価バージョン名' })
  costVersionName: string;

  @ApiProperty({ example: '2024/04/01', description: '開始日' })
  startDate: string;

  @ApiProperty({ example: '2025/03/31', description: '終了日' })
  endDate: string;

  @ApiProperty({ example: '2024年度の原価バージョンです', description: '説明' })
  description: string;

  @ApiProperty({ example: '2024/03/01', description: '登録日' })
  createdOn: string;

  @ApiProperty({ example: 'user_001', description: '更新者' })
  modifiedBy: string;

  @ApiProperty({ example: '2024/03/01', description: '更新日' })
  modifiedOn: string;

  @ApiProperty({ example: 'KTN001', description: '系統コード' })
  businessunitId: string;

  @ApiProperty({ example: false, description: '原価登録レコードが存在するかどうか', required: false })
  hasCostRegisters?: boolean;
}