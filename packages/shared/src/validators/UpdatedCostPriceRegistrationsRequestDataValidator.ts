import type { CostPriceRegistrationPageBFF } from "../BFF/Pages/CostPriceRegistrationPageBFF";


export abstract class UpdatedCostPriceRegistrationsRequestDataValidator {

  public static validate(
    rawItems: ReadonlyArray<{ [key: string]: unknown; }>
  ): UpdatedCostPriceRegistrationsRequestDataValidator.ValidationResult {

    const IDsOfProcessedItems = new Set<string>();
    const validationErrorsDataForEachItem: Array<
      UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsDataForSpecificItem
    > = [];

    for (const [ itemIndex, item ] of rawItems.entries()) {

      const validationErrorsDataForCurrentItem: Array<UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorData> = [];

      if (typeof item.costPriceRegistrationID === "undefined") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsData.
              CostPriceRegistrationValue.Codes.notExists
        });
      } else if (typeof item.costPriceRegistrationID !== "string") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsData.
              CostPriceRegistrationID.Codes.existsButNotString,
          actualType: typeof item.costPriceRegistrationID
        });
      } else if (item.costPriceRegistrationID.length === 0) {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsData.
              CostPriceRegistrationID.Codes.stringButEmpty
        });
      } else if (IDsOfProcessedItems.has(item.costPriceRegistrationID)) {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsData.
              CostPriceRegistrationID.Codes.hasDuplicate
        });
      } else {
        IDsOfProcessedItems.add(item.costPriceRegistrationID);
      }


      if (typeof item.costPriceRegistrationValue === "undefined") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsData.
              CostPriceRegistrationValue.Codes.notExists
        });
      } else if (typeof item.costPriceRegistrationValue !== "number" || isNaN(item.costPriceRegistrationValue)) {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsData.
              CostPriceRegistrationValue.Codes.existsButNotNumber,
          actualType: typeof item.costPriceRegistrationValue === "number" && isNaN(item.costPriceRegistrationValue) ?
              "NaN" :
              typeof item.costPriceRegistrationValue
        })
      } else if (item.costPriceRegistrationValue < 0) {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsData.
              CostPriceRegistrationValue.Codes.lessThan0
        });
      }


      if (validationErrorsDataForCurrentItem.length > 0) {
       validationErrorsDataForEachItem.push({
          itemIndex,
          dataForEachError: validationErrorsDataForCurrentItem
        });
      }

    }


    return validationErrorsDataForEachItem.length > 0 ?
        {
          isInvalid: true,
          validationErrorsDataForEachItem
        } :
        {
          isInvalid: false,
          validatedData: rawItems as CostPriceRegistrationPageBFF.CostPriceRegistrationValuesUpdating.RequestData
        };

  }

}


export namespace UpdatedCostPriceRegistrationsRequestDataValidator {

  export type ValidationResult<> =
      {
        isInvalid: false;
        validatedData: CostPriceRegistrationPageBFF.CostPriceRegistrationValuesUpdating.RequestData;
      } |
      {

        isInvalid: true;

        /** @descriptionバリデーションエラーがない項目の場合、配列の指数と`itemIndex`が一致しない。 */
        validationErrorsDataForEachItem: ValidationErrorsDataForEachItem;

      };

  /** @descriptionバリデーションエラーがない項目の場合、配列の指数と`itemIndex`が一致しない。 */
  export type ValidationErrorsDataForEachItem = ReadonlyArray<ValidationErrorsDataForSpecificItem>;

  export type ValidationErrorsDataForSpecificItem = Readonly<{
    itemIndex: number;
    dataForEachError: ReadonlyArray<ValidationErrorData>;
  }>;

  export type ValidationErrorData =
      ValidationErrorsData.CostPriceRegistrationID |
      ValidationErrorsData.CostPriceRegistrationValue;

  export namespace ValidationErrorsData {

    export type CostPriceRegistrationID =
        CostPriceRegistrationID.NotExists |
        CostPriceRegistrationID.ExistsButNotString |
        CostPriceRegistrationID.StringButEmpty |
        CostPriceRegistrationID.HasDuplicate;


    export namespace CostPriceRegistrationID {

      export enum Codes {
        notExists = "COST_PRICE_REGISTRATION_ID-NOT_EXISTS",
        existsButNotString = "COST_PRICE_REGISTRATION_ID-EXISTS_BUT_NOT_STRING",
        stringButEmpty = "COST_PRICE_REGISTRATION_ID-STRING_BUT_EMPTY",
        hasDuplicate = "COST_PRICE_REGISTRATION_ID-HAS_DUPLICATE"
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotString = Readonly<{
        code: Codes.existsButNotString;
        actualType: string;
      }>;

      export type StringButEmpty = Readonly<{
        code: Codes.stringButEmpty;
      }>;

      export type HasDuplicate = Readonly<{
        code: Codes.hasDuplicate;
      }>;

    }

    export type CostPriceRegistrationValue =
        CostPriceRegistrationValue.NotExists |
        CostPriceRegistrationValue.ExistsButNotNumber |
        CostPriceRegistrationValue.DisallowedCharacters;

    export namespace CostPriceRegistrationValue {

      export enum Codes {
        notExists = "COST_PRICE_REGISTRATION_VALUE-NOT_EXISTS",
        existsButNotNumber = "COST_PRICE_REGISTRATION_VALUE-EXISTS_BUT_NOT_NUMBER",
        lessThan0 = "COST_PRICE_REGISTRATION_VALUE-LESS_THAN_0"
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotNumber = Readonly<{
        code: Codes.existsButNotNumber;
        actualType: string;
      }>;

      export type DisallowedCharacters = Readonly<{
        code: Codes.lessThan0;
      }>;

    }

  }

}
