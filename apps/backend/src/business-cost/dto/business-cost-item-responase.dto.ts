import { ApiProperty } from '@nestjs/swagger';

export class BusinessCostItemResponseDto {
  @ApiProperty({ example: 'bc_001', description: '事業部原価項目コードID' })
  buCostItemId: string;

  @ApiProperty({ example: 'bc_001', description: '事業部原価項目コードID' })
  buCostCodeId: string;

  @ApiProperty({ example: 'BU001', description: 'BUコード' })
  buCd: string;
}
