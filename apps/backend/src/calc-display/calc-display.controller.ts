import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CalcDisplayService } from './calc-display.service';
import { GetCalcDisplayResponse } from './dto/get-calc-display.dto';
import { GetCostItemsResponse } from './dto/get-cost-items.dto';
import { UpdateCalcDatasDto } from './dto/update-calc-datas.dto';

@Controller('calc-display')
export class CalcDisplayController {

  constructor(private readonly calcDisplayService: CalcDisplayService) {}

  @Get()
  async getCalcDisplays(
    @Query('businessunitId') businessUnitID: string,
    @Query('calcTypeId') calcTypeID: string,
    @Query('curCode') currencyCode: string = 'JPY'
  ): Promise<GetCalcDisplayResponse> {

    const _buCostCodes = await this.calcDisplayService.getBusinessUnitCostCodesSelection({
      businessUnitID,
      calcTypeID,
      currencyCode
    });

    // 取得対象のConditionとOperationのidを整理
    const _calcConditionIds = _buCostCodes
      .flatMap((buCostCode) =>
        buCostCode.buCostItem.calcDisplay?.calcFormulas.map((formula) => formula.calcConditionId)
      )
      .filter((id): id is string => !!id);
    const _calcOperationIds = _buCostCodes
      .flatMap((buCostCode) =>
        buCostCode.buCostItem.calcDisplay?.calcFormulas.flatMap((formula) => [
          formula.calcOperationId,
          formula.elseCalcOperationId,
        ])
      )
      .filter((id): id is string => !!id);
    const { conditions, operations } = await this.calcDisplayService.getConditionsAndOperations(
      _calcConditionIds,
      _calcOperationIds
    );
    // CostItemにマッピング
    const buCostCodes = _buCostCodes.map((buCostCode) => {
      const _conditions = conditions.filter((condition) =>
        buCostCode.buCostItem?.calcDisplay?.calcFormulas.some(
          (formula) => formula.calcConditionId === condition.calcConditionId
        )
      );
      const _operations = operations.filter((operation) =>
        buCostCode.buCostItem?.calcDisplay?.calcFormulas.some((formula) =>
          [formula.calcOperationId, formula.elseCalcOperationId].includes(operation.calcOperationId)
        )
      );
      return {
        ...buCostCode,
        buCostItem: {
          ...buCostCode.buCostItem,
          calcFormulas: buCostCode.buCostItem?.calcDisplay?.calcFormulas,
          calcConditions: _conditions,
          calcOperations: _operations,
        },
      };
    });

    return {
      buCostCodes,
    };
  }

  @Get('cost-items')
  async getCostItems(
    @Query('businessunitId') businessunitId: string,
    @Query('curCode') curCode: string = 'JPY'
  ): Promise<GetCostItemsResponse> {
    return this.calcDisplayService.getCostItems(businessunitId, curCode);
  }

  @Post()
  async updateCalcDatas(@Body() updateCalcDatasDto: UpdateCalcDatasDto): Promise<void> {
    await this.calcDisplayService.updateCalcDatas(updateCalcDatasDto);
  }

}
