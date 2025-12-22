/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

import {

  /* ┅┅┅ Gateways ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricePatternTypeGateway,

  /* ┅┅┅ Contracts ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricePatternTypeTransactions,
  CostPricePatternTypeValidator

} from "@pxa-re-management/shared";

/* ┅┅┅ Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CostPricePatternTypeAddingRequestDTO from "./DTOs/CostPricePatternTypeAddingRequestDTO";
import CostPricePatternTypeUpdatingRequestDTO from "./DTOs/CostPricePatternTypeUpdatingRequestDTO";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as NestJS from "@nestjs/common";


@NestJS.Controller(CostPricePatternTypeTransactions.URI_PATH_PREFIX)
export default class CostPricePatternTypeController {

  public constructor(
    @NestJS.Inject("CostPricePatternTypeGateway")
    private readonly costPricePatternTypeGateway: CostPricePatternTypeGateway
  ) {}


  @NestJS.Post()
  @NestJS.HttpCode(NestJS.HttpStatus.CREATED)
  public async addOne(@NestJS.Body() requestData: CostPricePatternTypeAddingRequestDTO): Promise<void> {

    const validationResult: CostPricePatternTypeValidator.ValidationResult = CostPricePatternTypeValidator.validate(
      requestData,
      { categoriesCheckingStrategy: CostPricePatternTypeValidator.Options.CategoriesCheckingStrategy.full }
    );

    if (validationResult.isInvalid) {
      throw new NestJS.BadRequestException(validationResult.validationErrorsData);
    }


    return this.costPricePatternTypeGateway.addOne(requestData);

  }

  @NestJS.Patch()
  @NestJS.HttpCode(NestJS.HttpStatus.OK)
  public async updateOne(@NestJS.Body() requestData: CostPricePatternTypeUpdatingRequestDTO): Promise<void> {

    const validationResult: CostPricePatternTypeValidator.ValidationResult = CostPricePatternTypeValidator.validate(
      requestData,
      { categoriesCheckingStrategy: CostPricePatternTypeValidator.Options.CategoriesCheckingStrategy.expectingNoCategories }
    );

    if (validationResult.isInvalid) {
      throw new NestJS.BadRequestException(validationResult.validationErrorsData);
    }


    return this.costPricePatternTypeGateway.updateOne(requestData);

  }

}
