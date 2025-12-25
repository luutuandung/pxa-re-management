import type { DuplicateCostVersionType } from '@pxa-re-management/shared';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DuplicateCostVersionDto implements DuplicateCostVersionType {
  @IsString()
  @IsNotEmpty()
  sourceCostVersionId: string;

  @IsOptional()
  @IsString({ each: false })
  newCostVersionId?: string;

  @IsString()
  @IsNotEmpty()
  newCostVersionName: string;

  @IsString()
  @IsNotEmpty()
  ktnCd: string;
}