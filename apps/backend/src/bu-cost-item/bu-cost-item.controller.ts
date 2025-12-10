import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  BusinessCostItemBulkSaveRequest,
  BusinessCostItemResponse,
  NewBusinessCostItemRequestData,
  BusinessCostItemWithCode,
  UpdatedBusinessCostItemRequestDataValidator,
} from '@pxa-re-management/shared';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';
import { BuCostItemService } from './bu-cost-item.service';
import { BusinessCostItemBulkSaveRequestDto } from './dto/business-cost-item-bulk-save.dto';
import { BusinessCostItemResponseDto } from './dto/business-cost-item-response.dto';
import { BusinessCostItemSaveRequestDto } from './dto/business-cost-item-save.dto';
import { BuCostItemWithCode } from './types/bu-cost-item-with-code.type';

@Controller('bu-cost-item')
export class BuCostItemController {
  constructor(private readonly buCostItemService: BuCostItemService) {}

  @Get()
  @ApiOperation({
    summary: '事業部原価項目一覧取得',
    description: '事業部原価項目の一覧を取得します',
  })
  @ApiQuery({
    name: 'businessunitId',
    description: '事業部コード',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: [BusinessCostItemResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async findAll(@Query('businessunitId') businessunitId: string): Promise<BusinessCostItemResponse> {
    const businessCostItems = await this.buCostItemService.findByBusinessUnitID(businessunitId);
    const items = businessCostItems.map((item) => this.parseBusinessCostItemToDto(item));
    return { items };
  }

  @Post()
  @ApiOperation({
    summary: '事業部原価項目作成',
    description: '事業部原価項目を作成します',
  })
  @ApiBody({ type: BusinessCostItemSaveRequestDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '作成成功',
  })
  async create(@Body() data: NewBusinessCostItemRequestData): Promise<void> {
    await this.buCostItemService.createOne(data);
  }

  @Put('bulk/update')
  @ApiOperation({
    summary: '事業部原価項目一括更新',
    description: '事業部原価項目を一括更新します',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
  })
  async updateMultiple(@Body() rawData: unknown): Promise<void> {

    if (!Array.isArray(rawData)) {
      throw new BadRequestException('事業部原価項目の配列を期待、非配列取得');
    }


    if (!rawData.every((element: unknown): boolean => typeof element === "object" && element !== null)) {
      throw new BadRequestException('事業部原価項目配列の中に非オブジェクトの要素かnullの要素が存在');
    }


    const rawUpdatedBusinessCostItemRequestDataValidationResult: UpdatedBusinessCostItemRequestDataValidator.ValidationResult =
        UpdatedBusinessCostItemRequestDataValidator.validate(rawData);

    if (rawUpdatedBusinessCostItemRequestDataValidationResult.isInvalid) {
      throw new BadRequestException({
        validationErrors: rawUpdatedBusinessCostItemRequestDataValidationResult.validationErrorsDataForEachItem
      });
    }


    await this.buCostItemService.updateMultiple(rawUpdatedBusinessCostItemRequestDataValidationResult.items);

  }

  @Put('bulk')
  @ApiOperation({
    summary: '事業部原価項目一括新規追加・既存更新',
    description: '事業部原価項目を一括で新しく追加し、既存のものを更新します',
  })
  @ApiBody({ type: BusinessCostItemBulkSaveRequestDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
  })
  async createAndUpdateMultiple(@Body() data: BusinessCostItemBulkSaveRequest): Promise<void> {
    await this.buCostItemService.createAndUpdateMultiple(data);
  }

  // データ変換（大幅に簡素化）
  private parseBusinessCostItemToDto(item: BuCostItemWithCode): BusinessCostItemWithCode {
    return {
      buCostItemId: item.buCostItemId,
      buCostCode: {
        buCostCodeId: item.buCostCode.buCostCodeId,
        businessunitId: item.buCostCode.businessunitId,
        generalCostCd: item.buCostCode.generalCostCd,
        buCostCd: item.buCostCode.buCostCd,
        buCostNameJa: item.buCostCode.buCostNameJa,
        buCostNameEn: item.buCostCode.buCostNameEn,
        buCostNameZh: item.buCostCode.buCostNameZh,
        deleteFlg: item.buCostCode.deleteFlg,
        createdBy: item.buCostCode.createdBy,
        createdOn: item.buCostCode.createdOn.toISOString(),
        modifiedBy: item.buCostCode.modifiedBy,
        modifiedOn: item.buCostCode.modifiedOn.toISOString(),
      },
      startDate: item.startDate,
      endDate: item.endDate,
      curCd: item.curCd,
      amountValidFlg: item.amountValidFlg,
      rateValidFlg: item.rateValidFlg,
      calcValidFlg: item.calcValidFlg,
      autoCreateValidFlg: item.autoCreateValidFlg,
    };
  }
}
