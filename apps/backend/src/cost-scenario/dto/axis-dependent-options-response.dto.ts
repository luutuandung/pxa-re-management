import { ApiProperty } from '@nestjs/swagger';

export class AxisDependentBusinessDto {
  @ApiProperty({
    description: 'シナリオビジネスID',
    example: 'SB001',
  })
  id: string;

  @ApiProperty({
    description: 'シナリオビジネス名（日本語）',
    example: 'シナリオビジネス名（日本語）',
  })
  nameJa: string;

  @ApiProperty({
    description: 'シナリオビジネス名（英語）',
    example: 'Scenario Business Name (English)',
  })
  nameEn: string;

  @ApiProperty({
    description: 'シナリオビジネス名（中国語）',
    example: 'シナリオビジネス名（中国語）',
  })
  nameZh: string;
}

export class AxisDependentCostVersionDto {
  @ApiProperty({
    description: '原価バージョンID',
    example: 'CV001',
  })
  id: string;

  @ApiProperty({
    description: '原価バージョン名',
    example: '原価バージョン名',
  })
  name: string;
}

export class AxisDependentOptionsResponseDto {
  @ApiProperty({
    description: '軸依存シナリオビジネス一覧',
    type: [AxisDependentBusinessDto],
  })
  scenarioBusinesses: AxisDependentBusinessDto[];

  @ApiProperty({
    description: '軸依存原価バージョン一覧',
    type: [AxisDependentCostVersionDto],
  })
  costVersions: AxisDependentCostVersionDto[];
}
