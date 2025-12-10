import { ApiProperty } from '@nestjs/swagger';

export class AxisOptionDto {
  @ApiProperty({
    description: '事業単位コード',
    example: 'BU001',
  })
  buCd: string;

  @ApiProperty({
    description: '事業単位名（日本語）',
    example: '事業単位名（日本語）',
  })
  nameJa: string;

  @ApiProperty({
    description: '事業単位名（英語）',
    example: 'Business Unit Name (English)',
  })
  nameEn: string;

  @ApiProperty({
    description: '事業単位名（中国語）',
    example: '事業単位名（中国語）',
  })
  nameZh: string;
}

export class ScenarioTypeOptionDto {
  @ApiProperty({
    description: 'シナリオタイプID',
    example: 'ST001',
  })
  id: string;

  @ApiProperty({
    description: 'シナリオタイプ名',
    example: 'シナリオタイプ名',
  })
  name: string;
}

export class ScenarioBusinessOptionDto {
  @ApiProperty({
    description: 'シナリオビジネスID',
    example: 'SB001',
  })
  id: string;

  @ApiProperty({
    description: 'シナリオビジネス名',
    example: 'シナリオビジネス名',
  })
  name: string;
}

export class CostVersionOptionDto {
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

export class RateTypeOptionDto {
  @ApiProperty({
    description: 'レートタイプ値',
    example: 1,
  })
  value: number;

  @ApiProperty({
    description: 'レートタイプラベル',
    example: 'Rate Type 1',
  })
  label: string;
}

export class SalesVersionOptionDto {
  @ApiProperty({
    description: '販売バージョンID',
    example: 'SV001',
  })
  id: string;

  @ApiProperty({
    description: '販売バージョン名',
    example: '販売バージョン名',
  })
  name: string;
}

export class CostScenarioOptionsResponseDto {
  @ApiProperty({
    description: '集計軸オプション一覧',
    type: [AxisOptionDto],
  })
  axisOptions: AxisOptionDto[];

  @ApiProperty({
    description: 'シナリオタイプオプション一覧',
    type: [ScenarioTypeOptionDto],
  })
  scenarioTypes: ScenarioTypeOptionDto[];

  @ApiProperty({
    description: 'シナリオビジネスオプション一覧',
    type: [ScenarioBusinessOptionDto],
  })
  scenarioBusinesses: ScenarioBusinessOptionDto[];

  @ApiProperty({
    description: '原価バージョンオプション一覧',
    type: [CostVersionOptionDto],
  })
  costVersions: CostVersionOptionDto[];

  @ApiProperty({
    description: 'レートタイプオプション一覧',
    type: [RateTypeOptionDto],
  })
  rateTypes: RateTypeOptionDto[];

  @ApiProperty({
    description: '販売バージョンオプション一覧',
    type: [SalesVersionOptionDto],
  })
  salesVersions: SalesVersionOptionDto[];
}
