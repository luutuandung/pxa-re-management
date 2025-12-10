import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class CommonFieldsDto {
  @ApiProperty({ description: '開始日（YYYYMM形式）', required: false })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: '終了日（YYYYMM形式）', required: false })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ description: '通貨コード', required: false })
  @IsString()
  @IsOptional()
  cur?: string;
}

export class FlagUpdateDto {
  @ApiProperty({ description: 'BuCostItemのID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'フラグ値' })
  invFlag: boolean;
}

export class IndividualFlagsDto {
  @ApiProperty({ description: '額フラグ更新', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FlagUpdateDto)
  amount?: FlagUpdateDto;

  @ApiProperty({ description: 'レートフラグ更新', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FlagUpdateDto)
  rate?: FlagUpdateDto;

  @ApiProperty({ description: '計算フラグ更新', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FlagUpdateDto)
  calcurate?: FlagUpdateDto;
}
export class BusinessCostItemUpdateRequestDto {
  @ApiProperty({ description: '事業部原価コードID' })
  @IsString()
  @IsOptional()
  buCostCodeId?: string;

  @ApiProperty({ description: '共通フィールド更新' })
  @IsOptional()
  @ValidateNested()
  @Type(() => CommonFieldsDto)
  commonFields?: CommonFieldsDto;

  @ApiProperty({ description: '個別フラグ更新' })
  @IsOptional()
  @ValidateNested()
  @Type(() => IndividualFlagsDto)
  individualFlags?: IndividualFlagsDto;
}
