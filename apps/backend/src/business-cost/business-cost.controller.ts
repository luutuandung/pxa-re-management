import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BuCostCode, BusinessCostResponse, BusinessCostWithNamesResponse } from '@pxa-re-management/shared';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';
import { BusinessCostService } from './business-cost.service';
import { BusinessCostResponseDto } from './dto/business-cost-response.dto';
import { BusinessCostSaveRequestDto } from './dto/business-cost-save.dto';

@ApiTags('businessCost')
@Controller('businessCost')
export class BusinessCostController {
  constructor(private readonly businessCostService: BusinessCostService) {}

  @Get('names')
  @ApiOperation({
    summary: '事業部原価項目名取得',
    description: '指定されたBUコードの事業部原価項目名を取得します',
  })
  @ApiQuery({
    name: 'buCd',
    description: 'BUコード',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: [BusinessCostResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'パラメータが不足しています',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '該当データなし',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async getBusinessCostNames(@Query('buCd') buCd: string): Promise<BusinessCostWithNamesResponse[]> {
    if (!buCd) {
      throw new BadRequestException('パラメータが不足しています。');
    }

    const buCostCodes = await this.businessCostService.getBusinessCostNames(buCd);
    return buCostCodes.map((buCostCode) => this.parseBusinessCostWithNamesToDto(buCostCode));
  }

  @Get(':id')
  @ApiOperation({
    summary: '事業部原価項目詳細取得',
    description: '指定されたIDの事業部原価項目詳細を取得します',
  })
  @ApiParam({
    name: 'id',
    description: '事業部原価項目コードID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: BusinessCostResponseDto,
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
  async findOne(@Param('id') id: string): Promise<BusinessCostWithNamesResponse> {
    const buCostCode = await this.businessCostService.findOne(id);
    return this.parseBusinessCostWithNamesToDto(buCostCode);
  }

  @Post('save')
  @ApiOperation({
    summary: '事業部原価項目コード登録',
    description: '事業部原価項目コードと項目名を登録します',
  })
  @ApiBody({ type: BusinessCostSaveRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '登録成功',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'リクエストエラー',
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async saveBusinessCostItems(@Body() request: BusinessCostSaveRequestDto): Promise<void> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID
    console.log('saveBusinessCostItems', request);

    await this.businessCostService.saveBusinessCostItems(request, userId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: '事業部原価項目削除',
    description: '指定されたIDの事業部原価項目を論理削除します',
  })
  @ApiParam({
    name: 'id',
    description: '事業部原価項目コードID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '削除成功',
    type: BusinessCostResponseDto,
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
  async remove(@Param('id') id: string): Promise<BusinessCostWithNamesResponse> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID

    const result = await this.businessCostService.remove(id, userId);
    return this.parseBusinessCostWithNamesToDto(result);
  }

  @Put(':id/deactivate')
  @ApiOperation({
    summary: '事業部原価項目無効化',
    description: '指定されたIDの事業部原価項目を無効化します',
  })
  @ApiParam({
    name: 'id',
    description: '事業部原価項目コードID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '無効化成功',
    type: BusinessCostResponseDto,
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
  async deactivate(@Param('id') id: string): Promise<BusinessCostWithNamesResponse> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID

    const result = await this.businessCostService.remove(id, userId);
    return this.parseBusinessCostWithNamesToDto(result);
  }

  @Put(':id/reactivate')
  @ApiOperation({
    summary: '事業部原価項目有効化',
    description: '指定されたIDの事業部原価項目を有効化します',
  })
  @ApiParam({
    name: 'id',
    description: '事業部原価項目コードID',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '有効化成功',
    type: BusinessCostResponseDto,
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
  async reactivate(@Param('id') id: string): Promise<BusinessCostWithNamesResponse> {
    // TODO: 実際のアプリケーションでは、認証されたユーザーIDを取得する
    const userId = 'system'; // 仮のユーザーID

    const result = await this.businessCostService.reactivate(id, userId);
    return this.parseBusinessCostWithNamesToDto(result);
  }

  private parseBuCostToDto(buCostCode: BuCostCode): BusinessCostResponse {
    return {
      buCostCodeId: buCostCode.buCostCodeId,
      businessunitId: buCostCode.businessunitId,
      generalCostCd: buCostCode.generalCostCd,
      buCostCd: buCostCode.buCostCd,
      buCostNameJa: buCostCode.buCostNameJa,
      buCostNameEn: buCostCode.buCostNameEn,
      buCostNameZh: buCostCode.buCostNameZh,
      deleteFlg: buCostCode.deleteFlg,
      createdBy: buCostCode.createdBy,
      createdOn: buCostCode.createdOn.toISOString(),
      modifiedBy: buCostCode.modifiedBy,
      modifiedOn: buCostCode.modifiedOn.toISOString(),
    };
  }

  private parseBusinessCostWithNamesToDto(
    buCostCode: BuCostCode & { generalCostCode?: any }
  ): BusinessCostWithNamesResponse {
    return {
      buCostCodeId: buCostCode.buCostCodeId,
      businessunitId: buCostCode.businessunitId,
      generalCostCd: buCostCode.generalCostCd,
      buCostCd: buCostCode.buCostCd,
      buCostNameJa: buCostCode.buCostNameJa,
      buCostNameEn: buCostCode.buCostNameEn,
      buCostNameZh: buCostCode.buCostNameZh,
      deleteFlg: buCostCode.deleteFlg,
      generalCostCode: buCostCode.generalCostCode || null,
      createdBy: buCostCode.createdBy,
      createdOn: buCostCode.createdOn.toISOString(),
      modifiedBy: buCostCode.modifiedBy,
      modifiedOn: buCostCode.modifiedOn.toISOString(),
    };
  }
}
