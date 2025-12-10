import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCalcTypeDto {
  @ApiProperty({
    description: '計算種類名（日本語）',
    example: '検証',
    required: false,
  })
  @IsString()
  @IsOptional()
  calcTypeNameJa?: string;

  @ApiProperty({
    description: '計算種類名（英語）',
    example: 'Verification',
    required: false,
  })
  @IsString()
  @IsOptional()
  calcTypeNameEn?: string;

  @ApiProperty({
    description: '計算種類名（中国語）',
    example: '验证',
    required: false,
  })
  @IsString()
  @IsOptional()
  calcTypeNameZh?: string;

  @ApiProperty({
    description: 'デフォルトフラグ',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  defaultFlg?: boolean;

  @ApiProperty({
    description: '拠点ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  businessunitId?: string;
}
