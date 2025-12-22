import type { UpdatedBusinessCostItemRequestData } from "../types/business-cost-item.types";
import { CodesOfAvailableCurrencies } from "../constants/CodesOfAvailableCurrencies";


export abstract class UpdatedBusinessCostItemRequestDataValidator {

  public static validate(
    rawItems: ReadonlyArray<{ [key: string]: unknown; }>
  ): UpdatedBusinessCostItemRequestDataValidator.ValidationResult {

    const IDsOfProcessedItems = new Set<string>();
    const validationErrorsDataForEachItem: Array<UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsDataForSpecificItem> = [];

    for (const [ itemIndex, item ] of rawItems.entries()) {

      const validationErrorsDataForCurrentItem: Array<UpdatedBusinessCostItemRequestDataValidator.ValidationErrorData> = [];

      if (typeof item.buCostItemId === "undefined") {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.BusinessCostItemID.Codes.notExists });
      } else if (typeof item.buCostItemId !== "string") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.BusinessCostItemID.Codes.existsButNotString,
          actualType: typeof item.buCostItemId
        });
      } else if (item.buCostItemId.length === 0) {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.BusinessCostItemID.Codes.stringButEmpty });
      } else if (IDsOfProcessedItems.has(item.buCostItemId)) {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.BusinessCostItemID.Codes.hasDuplicate });
      } else {
        IDsOfProcessedItems.add(item.buCostItemId);
      }


      if (typeof item.startDate === "undefined") {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.StartingYearMonth.Codes.notExists });
      } else if (typeof item.startDate !== "string") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.StartingYearMonth.Codes.existsButNotString,
          actualType: typeof item.startDate
        })
      } else if (!/^\d{6}$/.test(item.startDate)) {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.StartingYearMonth.Codes.disallowedCharacters });
      } else if (!UpdatedBusinessCostItemRequestDataValidator.areCharactersOfYearMonthExpressionValid(Array.from(item.startDate))) {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.StartingYearMonth.Codes.wrongDigitsAtSpecificPositions
        });
      }


      if (typeof item.endDate === "undefined") {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.EndingYearMonth.Codes.notExists });
      } else if (typeof item.endDate !== "string") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.EndingYearMonth.Codes.existsButNotString,
          actualType: typeof item.endDate
        });
      } else if (!/^\d{6}$/.test(item.endDate)) {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.EndingYearMonth.Codes.disallowedCharacters });
      } else if (!UpdatedBusinessCostItemRequestDataValidator.areCharactersOfYearMonthExpressionValid(Array.from(item.endDate))) {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.EndingYearMonth.Codes.wrongDigitsAtSpecificPositions
        });
      }


      if (typeof item.curCd === "undefined") {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.CurrencyCode.Codes.notExists });
      } else if (typeof item.curCd !== "string") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.CurrencyCode.Codes.existsButNotString,
          actualType: typeof item.curCd
        });
      } else if (!Object.values<string>(CodesOfAvailableCurrencies).includes(item.curCd)) {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.CurrencyCode.Codes.disallowedVariant,
          commaSeparatedAllowedVariants: Object.values(CodesOfAvailableCurrencies).join(", ")
        });
      }


      if (typeof item.amountValidFlg === "undefined") {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.AmountValidFlag.Codes.notExists });
      } else if (typeof item.amountValidFlg !== "boolean") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.AmountValidFlag.Codes.existsButNotBoolean,
          actualType: typeof item.amountValidFlg
        });
      }


      if (typeof item.rateValidFlg === "undefined") {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.RateValidFlag.Codes.notExists });
      } else if (typeof item.rateValidFlg !== "boolean") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.RateValidFlag.Codes.existsButNotBoolean,
          actualType: typeof item.rateValidFlg
        });
      }


      if (typeof item.calcValidFlg === "undefined") {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.CalcValidFlag.Codes.notExists });
      } else if (typeof item.calcValidFlg !== "boolean") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.RateValidFlag.Codes.existsButNotBoolean,
          actualType: typeof item.calcValidFlg
        });
      }


      if (typeof item.autoCreateValidFlg === "undefined") {
        validationErrorsDataForCurrentItem.
            push({ code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.AutoCreateValidFlag.Codes.notExists });
      } else if (typeof item.autoCreateValidFlg !== "boolean") {
        validationErrorsDataForCurrentItem.push({
          code: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsData.RateValidFlag.Codes.existsButNotBoolean,
          actualType: typeof item.autoCreateValidFlg
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
          items: rawItems as Array<UpdatedBusinessCostItemRequestData>
        };

  }

  private static areCharactersOfYearMonthExpressionValid(characters: ReadonlyArray<string>): boolean {
    return (
      characters[0] === "2" &&
      [ "0", "1" ].includes(characters[4]) &&
      [ "1", "2", "3", "4", "5", "6", "7", "8", "9" ].includes(characters[5])
    );
  }

}


export namespace UpdatedBusinessCostItemRequestDataValidator {

  export type ValidationResult =
      {
        isInvalid: false;
        items: Array<UpdatedBusinessCostItemRequestData>
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
      ValidationErrorsData.BusinessCostItemID |
      ValidationErrorsData.StartingYearMonth |
      ValidationErrorsData.EndingYearMonth |
      ValidationErrorsData.CurrencyCode |
      ValidationErrorsData.AmountValidFlag |
      ValidationErrorsData.RateValidFlag |
      ValidationErrorsData.CalcValidFlag |
      ValidationErrorsData.AutoCreateValidFlag;

  export namespace ValidationErrorsData {

    export type BusinessCostItemID =
        BusinessCostItemID.NotExists |
        BusinessCostItemID.ExistsButNotString |
        BusinessCostItemID.StringButEmpty |
        BusinessCostItemID.HasDuplicate;


    export namespace BusinessCostItemID {

      export enum Codes {
        notExists = "BUSINESS_COST_ITEM_ID-NOT_EXISTS",
        existsButNotString = "BUSINESS_COST_ITEM_ID-EXISTS_BUT_NOT_STRING",
        stringButEmpty = "BUSINESS_COST_ITEM_ID-STRING_BUT_EMPTY",
        hasDuplicate = "BUSINESS_COST_ITEM_ID-HAS_DUPLICATE"
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

    export type StartingYearMonth =
        StartingYearMonth.NotExists |
        StartingYearMonth.ExistsButNotString |
        StartingYearMonth.DisallowedCharacters |
        StartingYearMonth.WrongDigitsAtSpecificPositions;

    export namespace StartingYearMonth {

      export enum Codes {
        notExists = "STARTING_YEAR_MONTH-NOT_EXISTS",
        existsButNotString = "STARTING_YEAR_MONTH-EXISTS_BUT_NOT_STRING",
        disallowedCharacters = "STARTING_YEAR_MONTH-DISALLOWED_CHARACTERS",
        wrongDigitsAtSpecificPositions = "STARTING_YEAR_MONTH-WRONG_DIGITS_AT_SPECIFIC_POSITIONS"
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotString = Readonly<{
        code: Codes.existsButNotString;
        actualType: string;
      }>;

      export type DisallowedCharacters = Readonly<{
        code: Codes.disallowedCharacters;
      }>;

      export type WrongDigitsAtSpecificPositions = Readonly<{
        code: Codes.wrongDigitsAtSpecificPositions;
      }>;

    }


    export type EndingYearMonth =
        EndingYearMonth.NotExists |
        EndingYearMonth.ExistsButNotString |
        EndingYearMonth.DisallowedCharacters |
        EndingYearMonth.WrongDigitsAtSpecificPositions;

    export namespace EndingYearMonth {

      export enum Codes {
        notExists = "ENDING_YEAR_MONTH-NOT_EXISTS",
        existsButNotString = "ENDING_YEAR_MONTH-EXISTS_BUT_NOT_STRING",
        disallowedCharacters = "ENDING_YEAR_MONTH-DISALLOWED_CHARACTERS",
        wrongDigitsAtSpecificPositions = "ENDING_YEAR_MONTH-WRONG_DIGITS_AT_SPECIFIC_POSITIONS"
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotString = Readonly<{
        code: Codes.existsButNotString;
        actualType: string;
      }>;

      export type DisallowedCharacters = Readonly<{
        code: Codes.disallowedCharacters;
      }>;

      export type WrongDigitsAtSpecificPositions = Readonly<{
        code: Codes.wrongDigitsAtSpecificPositions;
      }>;

    }


    export type CurrencyCode =
        CurrencyCode.NotExists |
        CurrencyCode.ExistsButNotString |
        CurrencyCode.DisallowedVariant;

    export namespace CurrencyCode {

      export enum Codes {
        notExists = "CURRENCY_CODE-NOT_EXISTS",
        existsButNotString = "CURRENCY_CODE-EXISTS_BUT_NOT_STRING",
        disallowedVariant = "CURRENCY_CODE-DISALLOWED_VARIANT"
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotString = Readonly<{
        code: Codes.existsButNotString;
        actualType: string;
      }>;

      export type DisallowedVariant = Readonly<{
        code: Codes.disallowedVariant;
        commaSeparatedAllowedVariants: string;
      }>;

    }


    export type AmountValidFlag =
        AmountValidFlag.NotExists |
        AmountValidFlag.ExistsButNotBoolean;

    export namespace AmountValidFlag {

      export enum Codes {
        notExists = "AMOUNT_VALID_FLAG-NOT_EXISTS",
        existsButNotBoolean = "AMOUNT_VALID_FLAG-EXISTS_BUT_NOT_BOOLEAN",
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotBoolean = Readonly<{
        code: Codes.existsButNotBoolean;
        actualType: string;
      }>;

    }


    export type RateValidFlag =
        RateValidFlag.NotExists |
        RateValidFlag.ExistsButNotBoolean;

    export namespace RateValidFlag {

      export enum Codes {
        notExists = "RATE_VALID_FLAG-NOT_EXISTS",
        existsButNotBoolean = "RATE_VALID_FLAG-EXISTS_BUT_NOT_BOOLEAN",
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotBoolean = Readonly<{
        code: Codes.existsButNotBoolean;
        actualType: string;
      }>;

    }


    export type CalcValidFlag =
        CalcValidFlag.NotExists |
        CalcValidFlag.ExistsButNotBoolean;

    export namespace CalcValidFlag {

      export enum Codes {
        notExists = "CALC_VALID_FLAG-NOT_EXISTS",
        existsButNotBoolean = "CALC_VALID_FLAG-EXISTS_BUT_NOT_BOOLEAN",
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotBoolean = Readonly<{
        code: Codes.existsButNotBoolean;
        actualType: string;
      }>;

    }

    export type AutoCreateValidFlag =
        AutoCreateValidFlag.NotExists |
        AutoCreateValidFlag.ExistsButNotBoolean;

    export namespace AutoCreateValidFlag {

      export enum Codes {
        notExists = "AUTO_CREATE_VALID_FLAG-NOT_EXISTS",
        existsButNotBoolean = "AUTO_CREATE_VALID_FLAG-EXISTS_BUT_NOT_BOOLEAN",
      }

      export type NotExists = Readonly<{
        code: Codes.notExists;
      }>;

      export type ExistsButNotBoolean = Readonly<{
        code: Codes.existsButNotBoolean;
        actualType: string;
      }>;

    }

  }

}
