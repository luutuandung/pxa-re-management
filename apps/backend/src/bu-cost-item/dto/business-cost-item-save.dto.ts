import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class BusinessCostItemSaveRequestDto {
  @ApiProperty({ description: '事業部原価コードID' })
  @IsString()
  @IsNotEmpty()
  buCostCodeId: string;

  @ApiProperty({ description: '開始日（YYYYMM形式）' })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: '終了日（YYYYMM形式）' })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({ description: '通貨コード' })
  @IsString()
  @IsNotEmpty()
  curCd: string;

  @ApiProperty({ description: '額有効フラグ' })
  @IsBoolean()
  amountValidFlg: boolean;

  @ApiProperty({ description: 'レート有効フラグ' })
  @IsBoolean()
  rateValidFlg: boolean;

  @ApiProperty({ description: '計算有効フラグ' })
  @IsBoolean()
  calcValidFlg: boolean;

  @ApiProperty({ description: '自動作成有効フラグ' })
  @IsBoolean()
  autoCreateValidFlg: boolean;
}
