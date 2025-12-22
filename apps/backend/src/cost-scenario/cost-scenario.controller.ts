import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BusinessUnit } from '@prisma/client';
import {
  AxisDependentOptionsResponse,
  ConcatTarget,
  GetConcatTargetsResponse,
  GetCostScenarioOptionsResponse,
  SelectOption,
} from '@pxa-re-management/shared';
import { ApiErrorResponseDto } from '../common/dto/api-response.dto';
import { AzureBlobService } from '../azure-blob/azure-blob.service';
import { CostScenarioService } from './cost-scenario.service';
import { ConcatTargetsResponseDto } from './dto/concat-targets-response.dto';
import { CostScenarioOptionsResponseDto, RateTypeOptionDto } from './dto/cost-scenario-options-response.dto';
import { UploadScenarioResponseDto } from './dto/upload-scenario-response.dto';

@Controller('cost-scenario')
export class CostScenarioController {
  constructor(
    private readonly costScenarioService: CostScenarioService,
    private readonly azureBlobService: AzureBlobService
  ) {}

  @Get('options')
  @ApiOperation({
    summary: 'コストシナリオオプション取得',
    description: 'コストシナリオで使用するオプション一覧を取得します',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: CostScenarioOptionsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'サーバーエラー',
    type: ApiErrorResponseDto,
  })
  async getOptions(): Promise<GetCostScenarioOptionsResponse> {
    const [businessUnits, costVersions, rateExchanges, scenarioDetails, scenarioTypes] = await Promise.all([
      this.costScenarioService.getBusinessUnits(),
      this.costScenarioService.getCostVersions(),
      this.costScenarioService.getRateExchanges(),
      this.costScenarioService.getScenarioDetails(),
      this.costScenarioService.getScenarioTypes(),
    ]);

    const axisOptions = businessUnits.map((bu) => ({
      buCd: bu.buCd,
      nameJa: `${bu.name} ${bu.productNameJa}`.trim(),
      nameEn: `${bu.name} ${bu.productNameEn}`.trim(),
      nameZh: `${bu.name} ${bu.productNameZh}`.trim(),
    }));

    const costVersionOptions = costVersions.map((cv) => ({ id: cv.costVersionId, name: cv.costVersionName }));

    const distinctRateTypes = Array.from(new Set(rateExchanges.map((r) => r.rateType))).sort((a, b) => a - b);
    const rateTypes = distinctRateTypes.map((v) => ({ value: v, label: `Rate Type ${v}` }));

    // 販売バージョン名のユニークなリストを取得
    const distinctSalesVersions = Array.from(new Set(scenarioDetails.map((s) => s.salesVersionName)))
      .filter((name) => name && name.trim() !== '')
      .sort();
    const salesVersions = distinctSalesVersions.map((name, index) => ({
      id: `sales_version_${index}`,
      name: name,
    }));

    const scenarioTypeOptions = scenarioTypes.map((st) => ({
      id: st.scenarioTypeId,
      name: st.scenarioTypeName,
    }));

    return {
      axisOptions,
      scenarioTypes: scenarioTypeOptions,
      scenarioBusinesses: [],
      costVersions: costVersionOptions,
      rateTypes,
      salesVersions,
    };
  }

  @Get('concat-targets')
  @ApiOperation({
    summary: '連結対象取得',
    description: '指定された集計軸の親または子の連結対象を取得します',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: ConcatTargetsResponseDto,
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
  async getConcatTargets(
    @Query('axisBuCd') axisBuCd: string,
    @Query('mode') mode: 'parent' | 'child'
  ): Promise<GetConcatTargetsResponse> {
    // 簡易バリデーション
    if (!axisBuCd || !/^[A-Za-z0-9_-]{1,10}$/.test(axisBuCd)) {
      throw new BadRequestException('invalid axisBuCd');
    }
    if (mode !== 'parent' && mode !== 'child') {
      throw new BadRequestException('invalid mode');
    }

    const links = await this.costScenarioService.getConcatTargets({ axisBuCd, mode });

    const targets = links.flatMap((link) =>
      link.childBu && link.parentBu
        ? [{ childBu: link.childBu, parentBu: link.parentBu, aggConcatId: link.aggConcatId }]
        : []
    );

    return { targets: targets.map(this.parseConcatTarget) };
  }

  @Get('axis-options')
  @ApiOperation({
    summary: '軸依存オプション取得',
    description: '指定された事業単位に依存するオプションを取得します',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: [RateTypeOptionDto],
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
  async getAxisOptions(@Query('buCd') buCd: string): Promise<AxisDependentOptionsResponse> {
    if (!buCd || !/^[A-Za-z0-9_-]{1,10}$/.test(buCd)) {
      throw new BadRequestException('invalid buCd');
    }

    const bu = await this.costScenarioService.getBusinessUnitByBuCd(buCd);
    if (!bu) {
      return { scenarioBusinesses: [], costVersions: [] };
    }

    const [scenarioBusinesses, costVersions] = await Promise.all([
      this.costScenarioService.getScenarioBusinessesByBusinessUnitId(bu.businessunitId),
      this.costScenarioService.getCostVersionsByBusinessUnitId(bu.businessunitId),
    ]);

    const sbOptions = scenarioBusinesses.map((s) => ({
      id: s.scenarioBusinessId,
      nameJa: s.scenarioBusinessNameJa,
      nameEn: s.scenarioBusinessNameEn,
      nameZh: s.scenarioBusinessNameZh,
    }));

    const cvOptions = costVersions.map((c) => ({ id: c.costVersionId, name: c.costVersionName }));

    return { scenarioBusinesses: sbOptions, costVersions: cvOptions };
  }

  @Get('rate-type-options')
  @ApiOperation({
    summary: 'レートタイプオプション取得',
    description: 'レートタイプのオプションを取得します',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '取得成功',
    type: RateTypeOptionDto,
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
  async rateTypeOptions(): Promise<SelectOption[]> {
    const list = await this.costScenarioService.getCurrencies();
    const distinct = Array.from(new Set(list.map((r) => r.afterCurCd)))
      .filter(Boolean)
      .sort();
    return distinct.map((cur) => ({ value: cur, label: cur }));
  }

  @Post('upload')
  async uploadScenario(
    @Body('payload') payload: unknown,
    @Body('filename') filename?: string
  ): Promise<UploadScenarioResponseDto> {
    if (!payload) {
      throw new BadRequestException('payload is required');
    }

    const jsonData = JSON.stringify(payload, null, 2);

    try {
      const result = await this.azureBlobService.uploadCostAggregationScenario(jsonData, filename);

      // Extract filename from URL if not provided
      const finalFilename = filename || result.url.split('/').pop() || 'cost-aggregation-scenario.json';

      return {
        success: result.success,
        url: result.url,
        filename: finalFilename,
      };
    } catch (error) {
      throw new BadRequestException(`Failed to upload to Azure Blob Storage: ${error.message}`);
    }
  }

  parseConcatTarget(obj: { childBu: BusinessUnit; parentBu: BusinessUnit; aggConcatId: string }): ConcatTarget {
    return {
      childBu: {
        ...obj.childBu,
        createdOn: obj.childBu.createdOn.toISOString(),
        modifiedOn: obj.childBu.modifiedOn.toISOString(),
      },
      parentBu: {
        ...obj.parentBu,
        createdOn: obj.parentBu.createdOn.toISOString(),
        modifiedOn: obj.parentBu.modifiedOn.toISOString(),
      },
      aggConcatId: obj.aggConcatId,
    };
  }
}
