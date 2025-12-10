export abstract class CommonEnglishNamingValidator {

  /**
   * @example
   * const rawName: unknown = "...";
   *
   * const validationResult: CommonEnglishNamingValidator.ValidationResult = CommonEnglishNamingValidator.validate(rawName);
   *
   * if (validationResult.isInvalid) {
   *   console.error(validationResult.validationErrorData);
   * } else {
   *   console.log(validationResult.validName);
   * }
   */
  public static validate(
    rawCostPricePatternTypeEnglishName: unknown
  ): CommonEnglishNamingValidator.ValidationResult {

    if (typeof rawCostPricePatternTypeEnglishName === "undefined") {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonEnglishNamingValidator.ValidationErrorsData.Codes.notExists
        }
      };
    }


    if (typeof rawCostPricePatternTypeEnglishName !== "string") {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonEnglishNamingValidator.ValidationErrorsData.Codes.existsButNotString,
          actualType: typeof rawCostPricePatternTypeEnglishName
        }
      };
    }


    if (rawCostPricePatternTypeEnglishName.length === 0) {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonEnglishNamingValidator.ValidationErrorsData.Codes.stringButEmpty
        }
      };
    }


    let foundForbiddenCharacters: Set<string> = new Set();

    for (const character of Array.from(rawCostPricePatternTypeEnglishName)) {
      if (!/[\w\p{P}\s]/u.test(character)) {
        foundForbiddenCharacters.add(character);
      }
    }

    if (foundForbiddenCharacters.size > 0) {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonEnglishNamingValidator.ValidationErrorsData.Codes.invalidCharacters,
          commaSeparatedFoundInvalidCharacters: Array.from(foundForbiddenCharacters).join(", ")
        }
      };
    }


    return {
      isInvalid: false,
      validName: rawCostPricePatternTypeEnglishName
    };

  }

}


export namespace CommonEnglishNamingValidator {

  /* ━━━ Output ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type ValidationResult =
      {
        isInvalid: false;
        validName: string;
      } |
      {
        isInvalid: true;
        validationErrorData: ValidationErrorData;
      };

  /* ┅┅┅ Validation Errors ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  export type ValidationErrorData =
      ValidationErrorsData.NotExists |
      ValidationErrorsData.ExistsButNotString |
      ValidationErrorsData.StringButEmpty |
      ValidationErrorsData.InvalidCharacters;

  export namespace ValidationErrorsData {

    export enum Codes {

      /** @description 定義されていないか、明示的undefinedになっている */
      notExists = "COMMON_ENGLISH_NAMING-NOT_EXISTS",

      /** @description 定義されてはいるが、文字列にはなっていない */
      existsButNotString = "COMMON_ENGLISH_NAMING-EXISTS_BUT_NOT_STRING",

      /** @description 文字列になっているが、空文字 */
      stringButEmpty = "COMMON_ENGLISH_NAMING-STRING_BUT_EMPTY",

      /** @description 不正文字発見 */
      invalidCharacters = "COMMON_ENGLISH_NAMING-INVALID_CHARACTERS"

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

    export type InvalidCharacters = Readonly<{
      code: Codes.invalidCharacters;
      commaSeparatedFoundInvalidCharacters: string;
    }>;

  }

}
