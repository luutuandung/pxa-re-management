import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CostVersion } from '@pxa-re-management/shared';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';
import { CostVersionResponseDto } from './dto/cost-version-response.dto';
import { CreateCostVersionDto } from './dto/create-cost-version.dto';
import { DuplicateCostVersionDto } from './dto/duplicate-cost-version.dto';
import { UpdateCostVersionDto } from './dto/update-cost-version.dto';
import { CostVersionService } from './cost-version.service';

@ApiTags('costVersion')
@Controller('costVersion')
export class CostVersionController {
  constructor(private readonly costVersionService: CostVersionService) {}

  @Get()
  @ApiOperation({
    summary: '原価バージョン一覧取得',
    description: '原価バージョンの一覧を取得します（削除済みを除く）',
  })
  @ApiQuery({
    name: 'ktnCd',
    required: false,
    type: String,
    description: '系統コードでフィルタリング',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: [CostVersionResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async findAll(@Query('ktnCd') ktnCd?: string) {
    let costVersions: CostVersion[];
    if (ktnCd) {
      costVersions = await this.costVersionService.findAllByKtn(ktnCd);
    } else {
      costVersions = await this.costVersionService.findAll();
    }
    return costVersions.map((costVersion) => this.parseToDto(costVersion));
  }

  @Get(':id')
  @ApiOperation({
    summary: '原価バージョン詳細取得',
    description: '指定されたIDの原価バージョン詳細を取得します',
  })
  @ApiParam({
    name: 'id',
    description: '原価バージョンID',
    example: 'CV_2024_001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: CostVersionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '原価バージョンが見つかりません',
    type: ApiErrorResponseDto,
  })
  async findOne(@Param('id') id: string) {
    const costVersion = await this.costVersionService.findOne(id);
    return this.parseToDto(costVersion);
  }

  @Post()
  @ApiOperation({
    summary: '原価バージョン作成',
    description: '新しい原価バージョンを作成します',
  })
  @ApiBody({ type: CreateCostVersionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '作成成功',
    type: CostVersionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'バリデーションエラー',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '重複エラー',
    type: ApiErrorResponseDto,
  })
  async create(@Body() createCostVersionDto: CreateCostVersionDto) {
    const costVersion = await this.costVersionService.create(createCostVersionDto);
    return this.parseToDto(costVersion);
  }

  @Patch(':id')
  @ApiOperation({
    summary: '原価バージョン更新',
    description: '指定されたIDの原価バージョンを更新します',
  })
  @ApiParam({
    name: 'id',
    description: '原価バージョンID',
    example: 'CV_2024_001',
  })
  @ApiBody({ type: UpdateCostVersionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: CostVersionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '原価バージョンが見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'バリデーションエラー',
    type: ApiErrorResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateCostVersionDto: UpdateCostVersionDto) {
    const costVersion = await this.costVersionService.update(id, updateCostVersionDto);
    return this.parseToDto(costVersion);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '原価バージョン削除',
    description: '指定されたIDの原価バージョンを論理削除します',
  })
  @ApiParam({
    name: 'id',
    description: '原価バージョンID',
    example: 'CV_2024_001',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '削除成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '原価バージョンが見つかりません',
    type: ApiErrorResponseDto,
  })
  async remove(@Param('id') id: string) {
    await this.costVersionService.remove(id);
  }

  @Post('duplicate')
  @ApiOperation({
    summary: '原価バージョン複製',
    description: '既存の原価バージョンを複製して新しい原価バージョンを作成します',
  })
  @ApiBody({ type: DuplicateCostVersionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '複製成功',
    type: CostVersionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'コピー元の原価バージョンが見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '新しいIDが既に存在します',
    type: ApiErrorResponseDto,
  })
  async duplicate(@Body() duplicateCostVersionDto: DuplicateCostVersionDto) {
    const costVersion = await this.costVersionService.duplicate(duplicateCostVersionDto);
    return this.parseToDto(costVersion);
  }

  @Patch(':id/default')
  @ApiOperation({
    summary: 'デフォルトフラグ更新',
    description: '指定されたIDの原価バージョンのデフォルトフラグを更新します',
  })
  @ApiParam({
    name: 'id',
    description: '原価バージョンID',
    example: 'CV_2024_001',
  })
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        defaultFlg: { type: 'boolean', example: true },
      },
      required: ['defaultFlg'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: CostVersionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '原価バージョンが見つかりません',
    type: ApiErrorResponseDto,
  })
  async updateDefaultFlag(@Param('id') id: string, @Body('defaultFlg') defaultFlg: boolean) {
    const costVersion = await this.costVersionService.updateDefaultFlag(id, defaultFlg);
    return this.parseToDto(costVersion);
  }

  parseToDto(costVersion: CostVersion): CostVersionResponseDto {
    return {
      costVersionId: costVersion.costVersionId,
      costVersionName: costVersion.costVersionName,
      startDate: costVersion.startDate,
      endDate: costVersion.endDate,
      description: costVersion.description,
      createdOn: costVersion.createdOn.toISOString(),
      modifiedBy: costVersion.modifiedBy,
      modifiedOn: costVersion.modifiedOn.toISOString(),
      businessunitId: costVersion.businessunitId,
    };
  }
}