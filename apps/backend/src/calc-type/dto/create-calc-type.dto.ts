import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCalcTypeDto {
  @ApiProperty({
    description: '計算種類名（日本語）',
    example: '検証',
  })
  @IsString()
  @IsNotEmpty()
  calcTypeNameJa: string;

  @ApiProperty({
    description: '計算種類名（英語）',
    example: 'Verification',
  })
  @IsString()
  @IsNotEmpty()
  calcTypeNameEn: string;

  @ApiProperty({
    description: '計算種類名（中国語）',
    example: '验证',
  })
  @IsString()
  @IsNotEmpty()
  calcTypeNameZh: string;

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
  })
  @IsUUID()
  @IsNotEmpty()
  businessunitId: string;
}
