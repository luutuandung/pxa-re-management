import { CommonJapaneseNamingValidator } from "./common_naming/CommonJapaneseNamingValidator";
import { CommonEnglishNamingValidator} from "./common_naming/CommonEnglishNamingValidator";
import { CommonChineseNamingValidator } from "./common_naming/CommonChineseNamingValidator";
import { CostPricesPatternsCategoriesDataTypes } from "../constants/CostPricesPatternsCategoriesDataTypes";


export abstract class CostPricePatternTypeValidator {

  public static validate(
    rawData: CostPricePatternTypeValidator.RawInputData,
    options: CostPricePatternTypeValidator.Options
  ): CostPricePatternTypeValidator.ValidationResult {

    const validationErrorsData: Array<CostPricePatternTypeValidator.ValidationErrorData> = [];

    const japaneseNameValidationResult: CommonJapaneseNamingValidator.ValidationResult =
        CommonJapaneseNamingValidator.validate(rawData.costPricePatternNames.japanese);

    if (japaneseNameValidationResult.isInvalid) {
      validationErrorsData.push(japaneseNameValidationResult.validationErrorData);
    }


    const englishNameValidationResult: CommonEnglishNamingValidator.ValidationResult =
        CommonEnglishNamingValidator.validate(rawData.costPricePatternNames.english);

    if (englishNameValidationResult.isInvalid) {
      validationErrorsData.push(englishNameValidationResult.validationErrorData);
    }


    const chineseNameValidationResult: CommonChineseNamingValidator.ValidationResult =
        CommonChineseNamingValidator.validate(rawData.costPricePatternNames.chinese);

    if (chineseNameValidationResult.isInvalid) {
      validationErrorsData.push(chineseNameValidationResult.validationErrorData);
    }

    if (
      options.categoriesCheckingStrategy === CostPricePatternTypeValidator.Options.CategoriesCheckingStrategy.expectingNoCategories
    ) {

      if (typeof rawData.costPricePatternCategories !== "undefined") {
        validationErrorsData.push({ code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.Codes.unexpected });
      }

    } else {

      if (
        typeof rawData.costPricePatternCategories === "undefined" ||
            rawData.costPricePatternCategories.length === 0
      ) {

        validationErrorsData.push({ code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.Codes.noOne });

      } else {

        if (options.categoriesCheckingStrategy === CostPricePatternTypeValidator.Options.CategoriesCheckingStrategy.full) {

          for (const rawCostPricePatternCategoryData of rawData.costPricePatternCategories) {

            if (typeof rawCostPricePatternCategoryData.typeID === "undefined") {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.TypeID.Codes.notExists
              });

            } else if (typeof rawCostPricePatternCategoryData.typeID !== "string") {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.TypeID.Codes.existsButNotString,
                actualType: typeof rawCostPricePatternCategoryData.typeID
              });

            } else if (rawCostPricePatternCategoryData.typeID.length === 0) {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.TypeID.Codes.stringButEmpty
              });

            }


            if (typeof rawCostPricePatternCategoryData.dataType === "undefined") {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.DataType.Codes.notExists
              });

            } else if (typeof rawCostPricePatternCategoryData.dataType !== "number") {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.DataType.Codes.existsButNotNumber,
                actualType: typeof rawCostPricePatternCategoryData.dataType
              });

            } else if (
              !Object.values(CostPricesPatternsCategoriesDataTypes).includes(rawCostPricePatternCategoryData.dataType)
            ) {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.DataType.Codes.numberByNotAllowedVariant
              });

            }

            if (typeof rawCostPricePatternCategoryData.sequenceNumber === "undefined") {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.SequenceNumber.Codes.notExists
              });

            } else if (typeof rawCostPricePatternCategoryData.sequenceNumber !== "number") {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.SequenceNumber.Codes.existsButNotNumber,
                actualType: typeof rawCostPricePatternCategoryData.sequenceNumber
              });

            } else if (rawCostPricePatternCategoryData.sequenceNumber <= 0) {

              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.SequenceNumber.Codes.numberButNotPositive
              });

            } else if (!Number.isInteger(rawCostPricePatternCategoryData.sequenceNumber)) {
              validationErrorsData.push({
                code: CostPricePatternTypeValidator.ValidationErrorsData.Categories.SequenceNumber.Codes.numberButNotInteger
              });
            }

          }

        }

      }

    }

    return validationErrorsData.length > 0 ?
        {
          isInvalid: true,
          validationErrorsData
        } :
        {
          isInvalid: false,
          validData: rawData as CostPricePatternTypeValidator.ValidData
        };

  }

}


export namespace CostPricePatternTypeValidator {

  /* ━━━ Parameters ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Input Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type RawInputData = Readonly<{
    costPricePatternNames: Readonly<{
      japanese: unknown;
      english: unknown;
      chinese: unknown;
    }>;
    costPricePatternCategories?: ReadonlyArray<
      Readonly<{
        typeID: unknown;
        dataType: unknown;
        sequenceNumber: unknown;
      }>
    >;
  }>;


  /* ┅┅┅ Options ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type Options = Readonly<{

    categoriesCheckingStrategy: Options.CategoriesCheckingStrategy;

  }>;

  export namespace Options {

    export enum CategoriesCheckingStrategy {

      /** @description バックエンド側におけるバリデーション専用。 */
      full = "FULL",

      /** @description 新規原価パターン追加専用。。 */
      quantityOnly = "QUANTITY_ONLY",

      /** @description 既存原価パターン更新場合専用。既存更新の場合、カテゴリー更新が不可能なので、カテゴリーデータが期待されていない。 */
      expectingNoCategories = "SKIPPING"

    }

  }


  /* ━━━ Output ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type ValidationResult =
      {
        isInvalid: false;
        validData: ValidData;
      } |
      {
        isInvalid: true;
        validationErrorsData: ValidationErrorsData;
      };

  export type ValidData = Readonly<{
    costPricePatternNames: Readonly<{
      japanese: string;
      english: string;
      chinese: string;
    }>;
     costPricePatternCategories: ReadonlyArray<ValidData.CostPricePatternCategory>;
  }>;

  export namespace ValidData {
    export type CostPricePatternCategory = Readonly<{
      typeID: string;
      dataType: CostPricesPatternsCategoriesDataTypes;
      sequenceNumber: number;
    }>;
  }


  /* ┅┅┅ Validation Errors ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type ValidationErrorsData = ReadonlyArray<ValidationErrorData>;

  export type ValidationErrorData =
      CommonJapaneseNamingValidator.ValidationErrorData |
      CommonEnglishNamingValidator.ValidationErrorData |
      CommonChineseNamingValidator.ValidationErrorData |
      ValidationErrorsData.Categories;

  export namespace ValidationErrorsData {

    /* ╍╍╍ Categories ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    export type Categories =
        Categories.Unexpected |
        Categories.NoOne |
        Categories.TypeID |
        Categories.DataType |
        Categories.SequenceNumber;

    export namespace Categories {

      export enum Codes {
        unexpected = "COST_PRICE_PATTERN_TYPE-CATEGORY-UNEXPECTED",
        noOne = "COST_PRICE_PATTERN_TYPE-CATEGORY-NO_ONE"
      }

      export type Unexpected = Readonly<{
        code: Codes.unexpected;
      }>;

      export type NoOne = Readonly<{
        code: Codes.noOne;
      }>;


      /* ─── Type ID ──────────────────────────────────────────────────────────────────────────────────────────────── */
      export type TypeID =
          TypeID.NotExists |
          TypeID.ExistsButNotString |
          TypeID.StringButEmpty;

      export namespace TypeID {

        export enum Codes {
          notExists = "CATEGORY-TYPE_ID-NOT_EXISTS",
          existsButNotString = "CATEGORY-TYPE_ID-EXISTS_BUT_NOT_STRING",
          stringButEmpty = "CATEGORY-TYPE_ID-STRING_BUT_EMPTY"
        }

        export type NotExists = { code: Codes.notExists; }

         export type ExistsButNotString = Readonly<{
          code: Codes.existsButNotString;
          actualType: string;
        }>;

        export type StringButEmpty = Readonly<{
          code: Codes.stringButEmpty;
        }>;

      }


      /* ─── Data Type ────────────────────────────────────────────────────────────────────────────────────────────── */
      export type DataType =
          DataType.NotExists |
          DataType.ExistsButNotNumber |
          DataType.NumberByNotAllowedVariant;

      export namespace DataType {

        export enum Codes {
          notExists = "CATEGORY-DATA_TYPE-NOT_EXISTS",
          existsButNotNumber = "CATEGORY-DATA_TYPE-EXISTS_BUT_NOT_NUMBER",
          numberByNotAllowedVariant = "CATEGORY-DATA_TYPE-NUMBER_BUT_NOT_ALLOWED_VARIANT"
        }

        export type NotExists = {
          code: Codes.notExists;
        }

        export type ExistsButNotNumber = {
          code: Codes.existsButNotNumber;
          actualType: string;
        }

        export type NumberByNotAllowedVariant = {
          code: Codes.numberByNotAllowedVariant;
        }

      }


      /* ─── Sequence Number ──────────────────────────────────────────────────────────────────────────────────────── */
      export type SequenceNumber =
          SequenceNumber.NotExists |
          SequenceNumber.ExistsButNotNumber |
          SequenceNumber.NumberButNotPositive |
          SequenceNumber.NumberButNotInteger;

      export namespace SequenceNumber {

        export enum Codes {
          notExists = "CATEGORY-SEQUENCE_NUMBER-NOT_EXISTS",
          existsButNotNumber = "CATEGORY-SEQUENCE_NUMBER-EXISTS_BUT_NOT_NUMBER",
          numberButNotPositive = "CATEGORY-SEQUENCE_NUMBER-NUMBER_BUT_NOT_POSITIVE",
          numberButNotInteger = "CATEGORY-SEQUENCE_NUMBER-NUMBER_BUT_NOT_INTEGER"
        }

        export type NotExists = {
          code: Codes.notExists;
        }

        export type ExistsButNotNumber = {
          code: Codes.existsButNotNumber;
          actualType: string;
        }

        export type NumberButNotPositive = {
          code: Codes.numberButNotPositive;
        }

        export type NumberButNotInteger = Readonly<{
          code: Codes.numberButNotInteger;
        }>;

      }

    }

  }

}
