import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BusinessUnit } from '@prisma/client';
import { BusinessUnitItem, GetBusinessUnitListResponse } from '@pxa-re-management/shared';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';
import { BusinessUnitService } from './business-unit.service';
import { BusinessUnitListResponseDto } from './dto/business-unit-list-response.dto';

@Controller('business-unit')
export class BusinessUnitController {
  constructor(private readonly businessUnitService: BusinessUnitService) {}

  @Get('')
  @ApiOperation({
    summary: '事業部原価項目コード一覧取得',
    description: '事業部原価項目コードの一覧を取得します',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: [BusinessUnitListResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async getBusinessCostKtns(): Promise<GetBusinessUnitListResponse> {
    const buCostCodes = await this.businessUnitService.getBusinessUnitList();
    const businessUnits = buCostCodes.map((code) => this.parseBusinessUnitToDto(code));
    return { businessUnits };
  }

  private parseBusinessUnitToDto(b: BusinessUnit): BusinessUnitItem {
    return {
      businessunitId: b.businessunitId,
      buCd: b.buCd,
      name: b.name,
      baseCurrencyName: b.baseCurrencyName,
      businessunitNameJa: b.businessunitNameJa,
      productNameJa: b.productNameJa,
      businessunitNameEn: b.businessunitNameEn,
      productNameEn: b.productNameEn,
      businessunitNameZh: b.businessunitNameZh,
      productNameZh: b.productNameZh,
      createdBy: b.createdBy,
      createdOn: b.createdOn.toISOString(),
      modifiedBy: b.modifiedBy,
      modifiedOn: b.modifiedOn.toISOString(),
    };
  }
}
