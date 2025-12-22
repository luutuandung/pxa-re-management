/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPriceRegistrationPageBFF,

  /* ┅┅┅ Contracts ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPriceRegistrationPageTransactions,
  UpdatedCostPriceRegistrationsRequestDataValidator

} from "@pxa-re-management/shared";

/* ┅┅┅ Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CostPriceRegistrationTableDataRetrievingRequestDTO from "./DTOs/CostPriceRegistrationTableDataRetrievingRequestDTO";
import CostPricePatternsDropDownListItemsRetrievingRequestDTO from "./DTOs/CostPricePatternsDropDownListItemsRetrievingRequestDTO";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as NestJS from "@nestjs/common";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import JSON_BodyMaximalSizeInterceptor from "../../../Middlewares/JSON_BodyMaximalSizeInterceptor";


@NestJS.Controller(CostPriceRegistrationPageTransactions.URI_PATH_PREFIX)
export default class CostPriceRegistrationPageController {

  public constructor(
    @NestJS.Inject("CostPriceRegistrationPageBFF")
    private readonly costPriceRegistrationPagePrismaService: CostPriceRegistrationPageBFF,
  ) {}


  @NestJS.Get(CostPriceRegistrationPageTransactions.TableDataRetrieving.URI_PATH_SPECIFIC_PART)
  public async retrieveTableData(
    @NestJS.Query() requestParameters: CostPriceRegistrationTableDataRetrievingRequestDTO
  ): Promise<CostPriceRegistrationPageBFF.TableDataRetrieving.ResponseData> {
    return this.costPriceRegistrationPagePrismaService.retrieveTableData(requestParameters);
  }

  @NestJS.Get(CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.URI_PATH_SPECIFIC_PART)
  public async retrievePatternsDropDownData(
    @NestJS.Query() requestParameters: CostPricePatternsDropDownListItemsRetrievingRequestDTO
  ): Promise<CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData> {
    return this.costPriceRegistrationPagePrismaService.retrieveCostPricePatternsDropDownListItems(requestParameters);
  }

  @NestJS.Patch(CostPriceRegistrationPageTransactions.CostPriceRegistrationValuesUpdating.URI_PATH_SPECIFIC_PART)
  @NestJS.HttpCode(NestJS.HttpStatus.OK)
  @NestJS.UseInterceptors(JSON_BodyMaximalSizeInterceptor.setup({ bodyLimit__bytes: 1_000_000 }))
  public async updateCostPricesValues(@NestJS.Body() rawData: unknown): Promise<void> {

    if (!Array.isArray(rawData)) {
      throw new NestJS.BadRequestException("原価登録値更新：配列を期待、非配列取得");
    }


    if (!rawData.every((element: unknown): boolean => typeof element === "object" && element !== null)) {
      throw new NestJS.BadRequestException("原価登録値更新：オブジェクトに要素の配列を期待、非オブジェクト要素かnull要素発見");
    }


    /* 【 整備性 】
     * フロントエンド側におけるバリデーションとバックエンド側におけるバリデーションがずれないように、UpdatedCostPriceRegistrationsRequestDataValidatorを利用する事。 */
    const rawUpdatedCostPriceRegistrationsRequestDataValidationResult:
        UpdatedCostPriceRegistrationsRequestDataValidator.ValidationResult =
            UpdatedCostPriceRegistrationsRequestDataValidator.validate(rawData);

    if (rawUpdatedCostPriceRegistrationsRequestDataValidationResult.isInvalid) {
      throw new NestJS.BadRequestException({
        validationErrors: rawUpdatedCostPriceRegistrationsRequestDataValidationResult.validationErrorsDataForEachItem
      });
    }


    return this.costPriceRegistrationPagePrismaService.updateCostPricesValues(
      rawUpdatedCostPriceRegistrationsRequestDataValidationResult.validatedData
    );

  }

}
