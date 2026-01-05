/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ Gateways ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  type BusinessUnitCostPriceItemGateway,
  type CurrencyGateway,

  /* ┅┅┅ Contracts ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  BusinessUnitCostPriceItemTransactions,
  BusinessUnitsCostPricesItemsDataValidator

} from "@pxa-re-management/shared";

/* ┅┅┅ Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import BusinessUnitCostPriceItemManagementRequestDTO from "./DTOs/BusinessUnitCostPriceItemManagementRequestDTO";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as NestJS from "@nestjs/common";


@NestJS.Controller(BusinessUnitCostPriceItemTransactions.URI_PATH_PREFIX)
export default class BusinessUnitCostPriceItemController {

   public constructor(

    @NestJS.Inject("BusinessUnitCostPriceItemGateway")
    private readonly businessUnitCostPriceItemGateway: BusinessUnitCostPriceItemGateway,

    @NestJS.Inject("CurrencyGateway")
    private readonly currencyGateway: CurrencyGateway

  ) {}

  @NestJS.Patch(BusinessUnitCostPriceItemTransactions.UpdatingOfMultipleOnes.URI_PATH_SPECIFIC_PART)
  public async updateMultiple(@NestJS.Body() rawData: unknown): Promise<void> {

    if (!Array.isArray(rawData)) {
      throw new NestJS.BadRequestException("事業部原価項目の配列を期待、非配列取得");
    }


    if (!rawData.every((element: unknown): boolean => typeof element === "object" && element !== null)) {
      throw new NestJS.BadRequestException("事業部原価項目配列の中に非オブジェクトの要素かnullの要素が存在");
    }


    const rawRequestDataValidationResult:
        BusinessUnitsCostPricesItemsDataValidator.
            ValidationResult<BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData.Item> =
                BusinessUnitsCostPricesItemsDataValidator.validate(
                  rawData,
                  {
                    codesOfAvailableCurrencies: new Set(await this.currencyGateway.retrieveCodesOfAvailableOnes()),
                    referenceYear: new Date().getFullYear(),
                    dataPurpose: BusinessUnitsCostPricesItemsDataValidator.DataPurposes.updating
                  }
                );

    if (rawRequestDataValidationResult.isInvalid) {
      throw new NestJS.BadRequestException({
        validationErrors: rawRequestDataValidationResult.validationErrorsDataForEachItem
      });
    }


    await this.businessUnitCostPriceItemGateway.updateMultiple(rawRequestDataValidationResult.items);

  }

  @NestJS.Post(BusinessUnitCostPriceItemTransactions.ManagementOfMultipleOnes.URI_PATH_SPECIFIC_PART)
  public async manageMultiple(
    @NestJS.Body() {
      updatedItems,
      newItems,
      businessUnitID
    }: BusinessUnitCostPriceItemManagementRequestDTO
  ): Promise<void> {

    const updatedItemsValidationResult:
        BusinessUnitsCostPricesItemsDataValidator.
            ValidationResult<BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData.Item> =
                BusinessUnitsCostPricesItemsDataValidator.validate(
                  updatedItems,
                  {
                    codesOfAvailableCurrencies: new Set(await this.currencyGateway.retrieveCodesOfAvailableOnes()),
                    referenceYear: new Date().getFullYear(),
                    dataPurpose: BusinessUnitsCostPricesItemsDataValidator.DataPurposes.updating
                  }
                );

    if (updatedItemsValidationResult.isInvalid) {
      throw new NestJS.BadRequestException({
        validationErrors: updatedItemsValidationResult.validationErrorsDataForEachItem
      });
    }


    const newItemsValidationResult:
        BusinessUnitsCostPricesItemsDataValidator.
            ValidationResult<BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData.NewItem> =
                BusinessUnitsCostPricesItemsDataValidator.validate(
                  newItems,
                  {
                    codesOfAvailableCurrencies: new Set(await this.currencyGateway.retrieveCodesOfAvailableOnes()),
                    referenceYear: new Date().getFullYear(),
                    dataPurpose: BusinessUnitsCostPricesItemsDataValidator.DataPurposes.creating
                  }
                );

    if (newItemsValidationResult.isInvalid) {
      throw new NestJS.BadRequestException({
        validationErrors: newItemsValidationResult.validationErrorsDataForEachItem
      });
    }


    return this.businessUnitCostPriceItemGateway.manageMultiple({
      updatedItems: updatedItemsValidationResult.items,
      newItems: newItemsValidationResult.items,
      businessUnitID
    });

  }

}
