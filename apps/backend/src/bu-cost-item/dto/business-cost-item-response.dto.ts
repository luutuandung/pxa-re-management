import { ApiProperty } from '@nestjs/swagger';

export class BusinessCostItemDto {
  @ApiProperty({ example: 'bci_001', description: '事業部原価項目ID' })
  buCostItemId: string;

  @ApiProperty({ example: 'bc_001', description: '事業部原価項目コードID' })
  buCostCodeId: string;

  @ApiProperty({ example: '2024-01-01', description: '開始日' })
  startDate: string;

  @ApiProperty({ example: '2024-12-31', description: '終了日' })
  endDate: string;

  @ApiProperty({ example: 'JPY', description: '通貨コード' })
  cur: string;

  @ApiProperty({ example: true, description: '計算フラグ' })
  calcurateFlag: boolean;

  @ApiProperty({ example: false, description: 'レートフラグ' })
  rateFlag: boolean;

  @ApiProperty({ example: true, description: '金額フラグ' })
  amountFlag: boolean;
}

export class BusinessCostItemResponseDto {
  @ApiProperty({
    type: [BusinessCostItemDto],
    description: '事業部原価項目のリスト',
  })
  items: BusinessCostItemDto[];
}
