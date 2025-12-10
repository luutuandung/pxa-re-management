import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GeneralCostCode } from '@pxa-re-management/shared';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';
import { CreateGeneralCostArrayDto, CreateGeneralCostDto } from './dto/create-general-cost.dto';
import { GeneralCostCodeResponseDto } from './dto/general-cost-response.dto';
import { UpdateGeneralCostDto } from './dto/update-general-cost.dto';
import { GeneralCostService } from './general-cost.service';

@ApiTags('generalCost')
@Controller('generalCost')
export class GeneralCostController {
  constructor(private readonly generalCostService: GeneralCostService) {}

  @Get('costCodes')
  @ApiOperation({
    summary: '統一原価項目コード一覧取得',
    description: '統一原価項目コードの一覧を取得します',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: [GeneralCostCodeResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async findAllCostCode(): Promise<GeneralCostCodeResponseDto[]> {
    const generalCosts = await this.generalCostService.findAllCostCode();
    return generalCosts.map((generalCost) => this.parseToDto(generalCost));
  }

  @Post('bulk')
  @ApiOperation({
    summary: '統一原価項目一括作成',
    description: '複数の統一原価項目を一括で作成します',
  })
  @ApiBody({ type: CreateGeneralCostArrayDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '作成成功',
    type: [GeneralCostCodeResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'バリデーションエラー',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async bulkCreate(@Body() createDto: CreateGeneralCostArrayDto): Promise<GeneralCostCodeResponseDto[]> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID

    const results = await this.generalCostService.bulkCreate(createDto.generalCosts, userId);
    return results.map((result) => this.parseToDto(result));
  }

  @Get()
  @ApiOperation({
    summary: '統一原価項目一覧取得',
    description: '統一原価項目の一覧を取得します',
  })
  @ApiQuery({
    name: 'includeDeleted',
    required: false,
    type: Boolean,
    description: '削除済み項目も含めて取得するかどうか',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: [GeneralCostCodeResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async findAll(@Query('includeDeleted') includeDeleted?: boolean): Promise<GeneralCostCodeResponseDto[]> {
    const generalCosts = await this.generalCostService.findAll(includeDeleted);
    return generalCosts.map((generalCost) => this.parseToDto(generalCost));
  }

  @Get(':id')
  @ApiOperation({
    summary: '統一原価項目詳細取得',
    description: '指定されたIDの統一原価項目詳細を取得します',
  })
  @ApiParam({
    name: 'id',
    description: '統一原価項目コードID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: GeneralCostCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '対象データが見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async findOne(@Param('id') id: string): Promise<GeneralCostCodeResponseDto> {
    const generalCost = await this.generalCostService.findOne(id);
    return this.parseToDto(generalCost);
  }

  @Post()
  @ApiOperation({
    summary: '統一原価項目作成',
    description: '新しい統一原価項目を作成します',
  })
  @ApiBody({ type: CreateGeneralCostDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '作成成功',
    type: GeneralCostCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'バリデーションエラー',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async create(@Body() createDto: CreateGeneralCostDto): Promise<GeneralCostCodeResponseDto> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID

    const result = await this.generalCostService.create(createDto, userId);
    return this.parseToDto(result);
  }

  @Put(':id')
  @ApiOperation({
    summary: '統一原価項目更新',
    description: '指定されたIDの統一原価項目を更新します',
  })
  @ApiParam({
    name: 'id',
    description: '統一原価項目コードID',
    type: String,
  })
  @ApiBody({ type: UpdateGeneralCostDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: GeneralCostCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'バリデーションエラー',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '対象データが見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async update(@Param('id') id: string, @Body() updateDto: UpdateGeneralCostDto): Promise<GeneralCostCodeResponseDto> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID

    console.log('統一原価項目更新エンドポイントが呼び出されました');
    console.log('id:', id);
    console.log('updateDto:', JSON.stringify(updateDto, null, 2));

    const result = await this.generalCostService.update(id, updateDto, userId);
    console.log('統一原価項目更新完了');
    return this.parseToDto(result);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '統一原価項目削除',
    description: '指定されたIDの統一原価項目を論理削除します',
  })
  @ApiParam({
    name: 'id',
    description: '統一原価項目コードID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '削除成功',
    type: GeneralCostCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '対象データが見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async remove(@Param('id') id: string): Promise<GeneralCostCodeResponseDto> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID

    const result = await this.generalCostService.remove(id, userId);
    return this.parseToDto(result);
  }

  @Put(':id/reactivate')
  @ApiOperation({
    summary: '統一原価項目有効化',
    description: '指定されたIDの統一原価項目を有効化します',
  })
  @ApiParam({
    name: 'id',
    description: '統一原価項目コードID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '有効化成功',
    type: GeneralCostCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '対象データが見つかりません',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async reactivate(@Param('id') id: string): Promise<GeneralCostCodeResponseDto> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID

    const result = await this.generalCostService.reactivate(id, userId);
    return this.parseToDto(result);
  }

  private parseToDto(generalCost: GeneralCostCode): GeneralCostCodeResponseDto {
    return {
      generalCostCodeId: generalCost.generalCostCodeId,
      generalCostCd: generalCost.generalCostCd,
      generalCostNameJa: generalCost.generalCostNameJa,
      generalCostNameEn: generalCost.generalCostNameEn,
      generalCostNameZh: generalCost.generalCostNameZh,
      deleteFlg: generalCost.deleteFlg,
      createdBy: generalCost.createdBy,
      createdOn: generalCost.createdOn,
      modifiedBy: generalCost.modifiedBy,
      modifiedOn: generalCost.modifiedOn,
    };
  }
}
