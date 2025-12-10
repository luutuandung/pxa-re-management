export abstract class CommonChineseNamingValidator {

  /**
   * @example
   * const rawName: unknown = "...";
   *
   * const validationResult: CommonChineseNamingValidator.ValidationResult = CommonChineseNamingValidator.validate(rawName);
   *
   * if (validationResult.isInvalid) {
   *   console.error(validationResult.validationErrorData);
   * } else {
   *   console.log(validationResult.validName);
   * }
   */
  public static validate(
    rawCostPricePatternTypeChineseName: unknown
  ): CommonChineseNamingValidator.ValidationResult {

    if (typeof rawCostPricePatternTypeChineseName === "undefined") {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonChineseNamingValidator.ValidationErrorsData.Codes.notExists
        }
      };
    }


    if (typeof rawCostPricePatternTypeChineseName !== "string") {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonChineseNamingValidator.ValidationErrorsData.Codes.existsButNotString,
          actualType: typeof rawCostPricePatternTypeChineseName
        }
      };
    }


    if (rawCostPricePatternTypeChineseName.length === 0) {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonChineseNamingValidator.ValidationErrorsData.Codes.stringButEmpty
        }
      };
    }


    let foundForbiddenCharacters: Set<string> = new Set();

    for (const character of Array.from(rawCostPricePatternTypeChineseName)) {

      /* 【 参考 】 https://www.javadrive.jp/regex-basic/sample/index9.html */
      if (!/[\u4E00-\u9FCC]/u.test(character)) {
        foundForbiddenCharacters.add(character);
      }

    }

    if (foundForbiddenCharacters.size > 0) {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonChineseNamingValidator.ValidationErrorsData.Codes.invalidCharacters,
          commaSeparatedFoundInvalidCharacters: Array.from(foundForbiddenCharacters).join(", ")
        }
      };
    }


    return {
      isInvalid: false,
      validName: rawCostPricePatternTypeChineseName
    };

  }

}


export namespace CommonChineseNamingValidator {

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
      notExists = "COMMON_CHINESE_NAMING-NOT_EXISTS",

      /** @description 定義されてはいるが、文字列にはなっていない */
      existsButNotString = "COMMON_CHINESE_NAMING-EXISTS_BUT_NOT_STRING",

      /** @description 文字列になっているが、空文字 */
      stringButEmpty = "COMMON_CHINESE_NAMING-STRING_BUT_EMPTY",

      /** @description 不正文字発見 */
      invalidCharacters = "COMMON_CHINESE_NAMING-INVALID_CHARACTERS"
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
