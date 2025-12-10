import { ApiProperty } from '@nestjs/swagger';

export class ConcatTargetDto {
  @ApiProperty({
    description: '子事業単位コード',
    example: 'BU001',
  })
  childBuCd: string;

  @ApiProperty({
    description: '親事業単位コード',
    example: 'BU002',
  })
  parentBuCd: string;

  @ApiProperty({
    description: '集計連結ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  aggConcatId: string;
}

export class ConcatTargetsResponseDto {
  @ApiProperty({
    description: '連結対象一覧',
    type: [ConcatTargetDto],
  })
  targets: ConcatTargetDto[];
}
