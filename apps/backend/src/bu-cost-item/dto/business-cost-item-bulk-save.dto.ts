import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { BusinessCostItemSaveRequestDto } from './business-cost-item-save.dto';
import { BusinessCostItemUpdateRequestDto } from './business-cost-item-update.dto';

export class BusinessCostItemBulkSaveRequestDto {
  @ApiProperty({
    description: '新規作成アイテム',
    type: [BusinessCostItemSaveRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessCostItemSaveRequestDto)
  newItems: BusinessCostItemSaveRequestDto[];

  @ApiProperty({
    description: '更新アイテム',
    type: [BusinessCostItemUpdateRequestDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessCostItemUpdateRequestDto)
  updates: BusinessCostItemUpdateRequestDto[];
}
