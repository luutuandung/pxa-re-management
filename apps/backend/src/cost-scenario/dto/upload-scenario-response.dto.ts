import { ApiProperty } from '@nestjs/swagger';

export class UploadScenarioResponseDto {
  @ApiProperty({ description: 'Upload success status', example: true })
  success: boolean;

  @ApiProperty({ description: 'Blob URL', example: 'https://storageaccount.blob.core.windows.net/container/path/file.json' })
  url: string;

  @ApiProperty({ description: 'Filename', example: 'cost-aggregation-scenario-2024-01-01T12-00-00.json' })
  filename: string;
}

