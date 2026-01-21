import { BusinessUnitCostPriceItem } from "../Entities/BusinessUnitCostPriceItem";
import type { BusinessUnitCostPriceItemGateway } from "../Gateways/BusinessUnitCostPriceItemGateway";


export abstract class BusinessUnitsCostPricesItemsDataValidator {

  public static validate(
    rawItems: ReadonlyArray<Readonly<{ [key: string]: unknown; }>>,
    options: Readonly<{
      codesOfAvailableCurrencies: ReadonlySet<string>;
      referenceYear: number;
      dataPurpose: BusinessUnitsCostPricesItemsDataValidator.DataPurposes.updating;
      existingDatesByItemID?: ReadonlyMap<string, Readonly<{
        startingYearAndMonth__YYYYMM: string;
        endingYearAndMonth__YYYYMM: string | null;
      }>>;
    }>
  ): BusinessUnitsCostPricesItemsDataValidator.ValidationResult<
    BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData.Item
  >;

  public static validate(
    rawItems: ReadonlyArray<Readonly<{ [key: string]: unknown; }>>,
    options: Readonly<{
      codesOfAvailableCurrencies: ReadonlySet<string>;
      referenceYear: number;
      dataPurpose: BusinessUnitsCostPricesItemsDataValidator.DataPurposes.creating;
    }>
  ): BusinessUnitsCostPricesItemsDataValidator.ValidationResult<
    BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData.NewItem
  >

  public static validate<
    ValidItem extends BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData.Item |
        BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData.NewItem
  >(
    rawItems: ReadonlyArray<Readonly<{ [key: string]: unknown; }>>,
    {
      codesOfAvailableCurrencies,
      referenceYear,
      dataPurpose,
      existingDatesByItemID
    }: Readonly<{
      codesOfAvailableCurrencies: ReadonlySet<string>;
      referenceYear: number;
      dataPurpose: BusinessUnitsCostPricesItemsDataValidator.DataPurposes,
      existingDatesByItemID?: ReadonlyMap<string, Readonly<{
        startingYearAndMonth__YYYYMM: string;
        endingYearAndMonth__YYYYMM: string | null;
      }>>;
    }>
  ): BusinessUnitsCostPricesItemsDataValidator.ValidationResult<ValidItem> {

    const IDsOfProcessedItems = new Set<string>();
    const validationErrorsDataForEachItem: Array<
      BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsDataForSpecificItem
    > = [];

    const earliestYearOfActualityStarting: number =
        BusinessUnitCostPriceItem.YearOfActualityStarting.computeEarliestOne(referenceYear);

    const latestYearOfActualityStarting: number =
        BusinessUnitCostPriceItem.YearOfActualityStarting.computeLatestOne(referenceYear);

    const earliestYearOfActualityEnding: number =
        BusinessUnitCostPriceItem.YearOfActualityEnding.computeEarliestOne(referenceYear);

    const latestYearOfActualityEnding: number =
        BusinessUnitCostPriceItem.YearOfActualityEnding.computeLatestOne(referenceYear);

    for (const [ itemIndex, item ] of rawItems.entries()) {

      const validationErrorsDataForCurrentItem: Array<BusinessUnitsCostPricesItemsDataValidator.ValidationErrorData> = [];

      switch (dataPurpose) {

        case BusinessUnitsCostPricesItemsDataValidator.DataPurposes.updating: {

          if (typeof item.businessUnitCostPriceItemID === "undefined") {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.
                  BusinessUnitCostPriceItemID.Codes.notExists
            });
          } else if (typeof item.businessUnitCostPriceItemID !== "string") {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.
                  BusinessUnitCostPriceItemID.Codes.existsButNotString,
              actualType: typeof item.businessUnitCostPriceItemID
            });
          } else if (item.businessUnitCostPriceItemID.length === 0) {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.
                  BusinessUnitCostPriceItemID.Codes.stringButEmpty
            });
          } else if (IDsOfProcessedItems.has(item.businessUnitCostPriceItemID)) {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.
                  BusinessUnitCostPriceItemID.Codes.hasDuplicate
            });
          } else {
            IDsOfProcessedItems.add(item.businessUnitCostPriceItemID);
          }

          break;

        }

        case BusinessUnitsCostPricesItemsDataValidator.DataPurposes.creating: {

          if (typeof item.businessUnitCostPriceCodeID === "undefined") {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.
                  BusinessUnitCostPriceCodeID.Codes.notExists
            });
          } else if (typeof item.businessUnitCostPriceCodeID !== "string") {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.
                  BusinessUnitCostPriceCodeID.Codes.existsButNotString,
              actualType: typeof item.businessUnitCostPriceCodeID
            });
          } else if (item.businessUnitCostPriceCodeID.length === 0) {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.
                  BusinessUnitCostPriceCodeID.Codes.stringButEmpty
            });
          }

          break;

        }

      }

      if (dataPurpose === BusinessUnitsCostPricesItemsDataValidator.DataPurposes.updating) {

      }


      let contextIndependentlyValidYearOfActualityStarting: number | undefined;
      let contextIndependentlyValidMontNumberOfActualityStarting__numerationFrom1: number | undefined;

      if (typeof item.startingYearAndMonth__YYYYMM === "undefined") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.StartingYearMonth.Codes.notExists
        });
      } else if (typeof item.startingYearAndMonth__YYYYMM !== "string") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.StartingYearMonth.Codes.existsButNotString,
          actualType: typeof item.startingYearAndMonth__YYYYMM
        });
      } else if (!/^\d{6}$/.test(item.startingYearAndMonth__YYYYMM)) {
        validationErrorsDataForCurrentItem.
            push({ code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.StartingYearMonth.Codes.disallowedCharacters });
      } else if (
        !BusinessUnitsCostPricesItemsDataValidator.
            areCharactersOfYearMonthExpressionValid(Array.from(item.startingYearAndMonth__YYYYMM))
      ) {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.StartingYearMonth.Codes.
              wrongDigitsAtSpecificPositions
        });
      } else {

        const yearOfActualityStarting: number = Number(item.startingYearAndMonth__YYYYMM.slice(0, 4));
        
        let shouldValidateYear = true;
        if (
          dataPurpose === BusinessUnitsCostPricesItemsDataValidator.DataPurposes.updating &&
          typeof item.businessUnitCostPriceItemID === "string" &&
          existingDatesByItemID !== undefined
        ) {
          const existingDates = existingDatesByItemID.get(item.businessUnitCostPriceItemID);
          if (existingDates !== undefined && existingDates.startingYearAndMonth__YYYYMM === item.startingYearAndMonth__YYYYMM) {
            // 日付が変更されていない場合は年バリデーションをスキップ
            shouldValidateYear = false;
          }
        }

        if (shouldValidateYear) {
          if (yearOfActualityStarting < earliestYearOfActualityStarting) {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.StartingYearMonth.Codes.
                yearIsEarlierThanEarliestOne,
              earliestYear: earliestYearOfActualityStarting
            });
          } else if (yearOfActualityStarting > latestYearOfActualityStarting) {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.StartingYearMonth.Codes.
                yearIsLaterThanLatestOne,
              latestYear: latestYearOfActualityStarting
            });
          } else {
            contextIndependentlyValidYearOfActualityStarting = yearOfActualityStarting;
          }
        } else {
          // バリデーションをスキップする場合でも、年は有効として扱う
          contextIndependentlyValidYearOfActualityStarting = yearOfActualityStarting;
        }

        const monthNumberOfActualityStarting__numerationFrom1 = Number(item.startingYearAndMonth__YYYYMM.slice(4));

        if (monthNumberOfActualityStarting__numerationFrom1 > 12) {
          validationErrorsDataForCurrentItem.push({
            code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.StartingYearMonth.Codes.
              invalidMonthNumber
          });
        } else {
          contextIndependentlyValidMontNumberOfActualityStarting__numerationFrom1 =
              monthNumberOfActualityStarting__numerationFrom1;
        }

      }


      let contextIndependentlyValidYearOfActualityEnding: number | undefined;
      let contextIndependentlyValidMontNumberOfActualityEnding__numerationFrom1: number | undefined;

      if (item.endingYearAndMonth__YYYYMM !== null) {

        if (typeof item.endingYearAndMonth__YYYYMM !== "string") {
          validationErrorsDataForCurrentItem.push({
            code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.EndingYearMonth.Codes.existsButNotString,
            actualType: typeof item.endingYearAndMonth__YYYYMM
          });
        } else if (!/^\d{6}$/.test(item.endingYearAndMonth__YYYYMM)) {
          validationErrorsDataForCurrentItem.push({
            code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.EndingYearMonth.Codes.disallowedCharacters
          });
        } else if (
          !BusinessUnitsCostPricesItemsDataValidator.
              areCharactersOfYearMonthExpressionValid(Array.from(item.endingYearAndMonth__YYYYMM))
        ) {
          validationErrorsDataForCurrentItem.push({
            code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.EndingYearMonth.Codes.
                wrongDigitsAtSpecificPositions
          });
        } else {

          const yearOfActualityEnding: number = Number(item.endingYearAndMonth__YYYYMM.slice(0, 4));

          let shouldValidateEndingYear = true;
          if (
            dataPurpose === BusinessUnitsCostPricesItemsDataValidator.DataPurposes.updating &&
            typeof item.businessUnitCostPriceItemID === "string" &&
            existingDatesByItemID !== undefined
          ) {
            const existingDates = existingDatesByItemID.get(item.businessUnitCostPriceItemID);
            if (existingDates !== undefined) {
              // nullとnull、または同じ文字列の場合は変更なしとみなす
              const existingEnding = existingDates.endingYearAndMonth__YYYYMM;
              const newEnding = item.endingYearAndMonth__YYYYMM;
              if (
                (existingEnding === null && newEnding === null) ||
                (existingEnding !== null && newEnding !== null && existingEnding === newEnding)
              ) {
                // 日付が変更されていない場合は年バリデーションをスキップ
                shouldValidateEndingYear = false;
              }
            }
          }

          if (shouldValidateEndingYear) {
            if (yearOfActualityEnding < earliestYearOfActualityEnding) {
              validationErrorsDataForCurrentItem.push({
                code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.EndingYearMonth.Codes.
                    yearIsEarlierThanEarliestOne,
                earliestYear: earliestYearOfActualityEnding
              });
            } else if (yearOfActualityEnding > latestYearOfActualityEnding) {
              validationErrorsDataForCurrentItem.push({
                code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.EndingYearMonth.Codes.
                    yearIsLaterThanLatestOne,
                latestYear: latestYearOfActualityEnding
              });
            } else {
              contextIndependentlyValidYearOfActualityEnding = yearOfActualityEnding;
            }
          } else {
            // バリデーションをスキップする場合でも、年は有効として扱う
            contextIndependentlyValidYearOfActualityEnding = yearOfActualityEnding;
          }


          const monthNumberOfActualityEnding__numerationFrom1 = Number(item.endingYearAndMonth__YYYYMM.slice(4));

          if (monthNumberOfActualityEnding__numerationFrom1 > 12) {
            validationErrorsDataForCurrentItem.push({
              code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.EndingYearMonth.Codes.
                  invalidMonthNumber
            });
          } else {
            contextIndependentlyValidMontNumberOfActualityEnding__numerationFrom1 =
                monthNumberOfActualityEnding__numerationFrom1;
          }

        }

      }

      if (
        typeof contextIndependentlyValidYearOfActualityStarting === "number" &&
            typeof contextIndependentlyValidMontNumberOfActualityStarting__numerationFrom1 === "number" &&
            typeof contextIndependentlyValidYearOfActualityEnding === "number" &&
            typeof contextIndependentlyValidMontNumberOfActualityEnding__numerationFrom1 === "number"  &&
            (
              new Date(
                contextIndependentlyValidYearOfActualityEnding,
                contextIndependentlyValidMontNumberOfActualityEnding__numerationFrom1 - 1
              ).getTime() <
                  new Date(
                    contextIndependentlyValidYearOfActualityStarting,
                    contextIndependentlyValidMontNumberOfActualityStarting__numerationFrom1 - 1
                  ).getTime()
            )
      ) {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.EndingYearMonth.Codes.
              earlierThanStartingOne
        });
      }


      if (typeof item.currencyCode === "undefined") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.CurrencyCode.Codes.notExists
        });
      } else if (typeof item.currencyCode !== "string") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.CurrencyCode.Codes.existsButNotString,
          actualType: typeof item.currencyCode
        });
      } else if (!codesOfAvailableCurrencies.has(item.currencyCode)) {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.CurrencyCode.Codes.disallowedVariant,
          commaSeparatedAllowedVariants: Array.from(codesOfAvailableCurrencies).join(", ")
        });
      }


      if (typeof item.isAmountValid === "undefined") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.AmountValidFlag.Codes.notExists
        });
      } else if (typeof item.isAmountValid !== "boolean") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.AmountValidFlag.Codes.existsButNotBoolean,
          actualType: typeof item.isAmountValid
        });
      }


      if (typeof item.isRateValid === "undefined") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.RateValidFlag.Codes.notExists
        });
      } else if (typeof item.isRateValid !== "boolean") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.RateValidFlag.Codes.existsButNotBoolean,
          actualType: typeof item.isRateValid
        });
      }


      if (typeof item.isCalculationValid === "undefined") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.CalcValidFlag.Codes.notExists
        });
      } else if (typeof item.isCalculationValid !== "boolean") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.RateValidFlag.Codes.existsButNotBoolean,
          actualType: typeof item.isCalculationValid
        });
      }


      if (typeof item.isDataLinkageAvailable === "undefined") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.AutoCreateValidFlag.Codes.notExists
        });
      } else if (typeof item.isDataLinkageAvailable !== "boolean") {
        validationErrorsDataForCurrentItem.push({
          code: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsData.RateValidFlag.Codes.existsButNotBoolean,
          actualType: typeof item.isDataLinkageAvailable
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
          items: rawItems as Array<ValidItem>
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


export namespace BusinessUnitsCostPricesItemsDataValidator {

  export enum DataPurposes {
    updating = "UPDATING",
    creating = "CREATING"
  }

  export type ValidationResult<
    ValidItem extends BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData.Item |
        BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData.NewItem
  > =
      {
        isInvalid: false;
        items: Array<ValidItem>;
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
      ValidationErrorsData.BusinessUnitCostPriceItemID |
      ValidationErrorsData.BusinessUnitCostPriceCodeID |
      ValidationErrorsData.StartingYearMonth |
      ValidationErrorsData.EndingYearMonth |
      ValidationErrorsData.CurrencyCode |
      ValidationErrorsData.AmountValidFlag |
      ValidationErrorsData.RateValidFlag |
      ValidationErrorsData.CalcValidFlag |
      ValidationErrorsData.AutoCreateValidFlag;

  export namespace ValidationErrorsData {

    export type BusinessUnitCostPriceItemID =
        BusinessUnitCostPriceItemID.NotExists |
        BusinessUnitCostPriceItemID.ExistsButNotString |
        BusinessUnitCostPriceItemID.StringButEmpty |
        BusinessUnitCostPriceItemID.HasDuplicate;

    export namespace BusinessUnitCostPriceItemID {

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

    export type BusinessUnitCostPriceCodeID =
      BusinessUnitCostPriceCodeID.NotExists |
      BusinessUnitCostPriceCodeID.ExistsButNotString |
      BusinessUnitCostPriceCodeID.StringButEmpty;

    export namespace BusinessUnitCostPriceCodeID {

      export enum Codes {
        notExists = "BUSINESS_UNIT_COST_PRICE_CODE_ID-NOT_EXISTS",
        existsButNotString = "BUSINESS_UNIT_COST_PRICE_CODE_ID-EXISTS_BUT_NOT_STRING",
        stringButEmpty = "BUSINESS_UNIT_COST_PRICE_CODE_ID-STRING_BUT_EMPTY"
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

    }

    export type StartingYearMonth =
        StartingYearMonth.NotExists |
        StartingYearMonth.ExistsButNotString |
        StartingYearMonth.DisallowedCharacters |
        StartingYearMonth.WrongDigitsAtSpecificPositions |
        StartingYearMonth.YearIsEarlierThanEarliestOne |
        StartingYearMonth.YearIsLaterThanLatestOne |
        StartingYearMonth.InvalidMonthNumber;

    export namespace StartingYearMonth {

      export enum Codes {
        notExists = "STARTING_YEAR_MONTH-NOT_EXISTS",
        existsButNotString = "STARTING_YEAR_MONTH-EXISTS_BUT_NOT_STRING",
        disallowedCharacters = "STARTING_YEAR_MONTH-DISALLOWED_CHARACTERS",
        wrongDigitsAtSpecificPositions = "STARTING_YEAR_MONTH-WRONG_DIGITS_AT_SPECIFIC_POSITIONS",
        yearIsEarlierThanEarliestOne = "STARTING_YEAR_MONTH-YEAR_IS_EARLIER_THAN_EARLIEST_ONE",
        yearIsLaterThanLatestOne = "STARTING_YEAR_MONTH-YEAR_IS_LATER_THAN_LATEST_ONE",
        invalidMonthNumber = "STARTING_YEAR_MONTH-INVALID_MONTH_NUMBER",
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

      export type YearIsEarlierThanEarliestOne = Readonly<{
        code: Codes.yearIsEarlierThanEarliestOne;
        earliestYear: number;
      }>;

      export type YearIsLaterThanLatestOne = Readonly<{
        code: Codes.yearIsLaterThanLatestOne;
        latestYear: number;
      }>;

      export type InvalidMonthNumber = Readonly<{
        code: Codes.invalidMonthNumber;
      }>;

    }


    export type EndingYearMonth =
        EndingYearMonth.ExistsButNotString |
        EndingYearMonth.DisallowedCharacters |
        EndingYearMonth.WrongDigitsAtSpecificPositions |
        EndingYearMonth.YearIsEarlierThanEarliestOne |
        EndingYearMonth.YearIsLaterThanLatestOne |
        EndingYearMonth.InvalidMonthNumber |
        EndingYearMonth.EarlierThanStartingOne;

    export namespace EndingYearMonth {

      export enum Codes {
        existsButNotString = "ENDING_YEAR_MONTH-EXISTS_BUT_NOT_STRING",
        disallowedCharacters = "ENDING_YEAR_MONTH-DISALLOWED_CHARACTERS",
        wrongDigitsAtSpecificPositions = "ENDING_YEAR_MONTH-WRONG_DIGITS_AT_SPECIFIC_POSITIONS",
        yearIsEarlierThanEarliestOne = "ENDING_YEAR_MONTH-YEAR_IS_EARLIER_THAN_EARLIEST_ONE",
        yearIsLaterThanLatestOne = "ENDING_YEAR_MONTH-YEAR_IS_LATER_THAN_LATEST_ONE",
        invalidMonthNumber = "ENDING_YEAR_MONTH-INVALID_MONTH_NUMBER",
        earlierThanStartingOne = "ENDING_YEAR_MONTH-EARLIER_THAN_STARTING_ONE",
      }

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

      export type YearIsEarlierThanEarliestOne = Readonly<{
        code: Codes.yearIsEarlierThanEarliestOne;
        earliestYear: number;
      }>;

      export type YearIsLaterThanLatestOne = Readonly<{
        code: Codes.yearIsLaterThanLatestOne;
        latestYear: number;
      }>;

      export type InvalidMonthNumber = Readonly<{
        code: Codes.invalidMonthNumber;
      }>;

      export type EarlierThanStartingOne = Readonly<{
        code: Codes.earlierThanStartingOne;
      }>

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
