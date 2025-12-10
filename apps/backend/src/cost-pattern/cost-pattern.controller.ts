import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CostPatternService } from './cost-pattern.service';

@Controller('cost-pattern')
export class CostPatternController {
  constructor(private readonly service: CostPatternService) {}

  @Get('business-units')
  getBusinessUnits() {
    return this.service.getBusinessUnits();
  }

  @Get('cost-versions')
  getCostVersions(@Query('businessunitId') businessunitId: string) {
    return this.service.getCostVersions(businessunitId);
  }

  @Get('pattern-details')
  getPatternDetails(@Query('businessunitId') _businessunitId?: string) {
    return this.service.getPatternDetails();
  }

  @Get('bu-cost-items')
  getBuCostItems(
    @Query('businessunitId') businessunitId: string,
    @Query('costVersionId') costVersionId?: string,
  ) {
    return this.service.getBuCostItems(businessunitId, costVersionId);
  }

  @Post('bulk-assign')
  bulkAssign(@Body() body: { costRegisterIds: string[]; costPatternDetailId: string }) {
    return this.service.bulkAssign(body);
  }

  @Get('category-options')
  getCategoryOptions() {
    return this.service.getCategoryOptions();
  }

  @Post('pattern-details')
  createPatternDetail(
    @Body()
    body: {
      costPatternName: string;
      costPatternModelCategories: { modelCategoryId: string; seq: number }[];
      costPatternDestCategories: { destCategoryId: string; secFlg: boolean; seq: number }[];
    },
  ) {
    return this.service.createPatternDetail(body);
  }
}


