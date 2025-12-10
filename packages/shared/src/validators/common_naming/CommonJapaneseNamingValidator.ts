export abstract class CommonJapaneseNamingValidator {

  /**
   * @example
   * const rawName: unknown = "...";
   *
   * const validationResult: CommonJapaneseNamingValidator.ValidationResult = CommonJapaneseNamingValidator.validate(rawName);
   *
   * if (validationResult.isInvalid) {
   *   console.error(validationResult.validationErrorData);
   * } else {
   *   console.log(validationResult.validName);
   * }
   */
  public static validate(
    rawCostPricePatternTypeJapaneseName: unknown
  ): CommonJapaneseNamingValidator.ValidationResult {

    if (typeof rawCostPricePatternTypeJapaneseName === "undefined") {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonJapaneseNamingValidator.ValidationErrorsData.Codes.notExists
        }
      };
    }


    if (typeof rawCostPricePatternTypeJapaneseName !== "string") {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonJapaneseNamingValidator.ValidationErrorsData.Codes.existsButNotString,
          actualType: typeof rawCostPricePatternTypeJapaneseName
        }
      };
    }


    if (rawCostPricePatternTypeJapaneseName.length === 0) {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonJapaneseNamingValidator.ValidationErrorsData.Codes.stringButEmpty
        }
      };
    }


    let foundForbiddenCharacters: Set<string> = new Set();

    for (const character of Array.from(rawCostPricePatternTypeJapaneseName)) {

      /*
       * 【 参考 】
       * https://www.javadrive.jp/regex-basic/sample/index9.html
       * https://qiita.com/Sux-mine/items/5a7932c1db1b8350d7e5
       * */
      if (!/[a-zA-Z0-9０-９ァ-ヶー\u3000-\u303F\u3040-\u309F\u4E00-\u9FFF]/u.test(character)) {
        foundForbiddenCharacters.add(character);
      }

    }

    if (foundForbiddenCharacters.size > 0) {
      return {
        isInvalid: true,
        validationErrorData: {
          code: CommonJapaneseNamingValidator.ValidationErrorsData.Codes.invalidCharacters,
          commaSeparatedFoundInvalidCharacters: Array.from(foundForbiddenCharacters).join(", ")
        }
      };
    }


    return {
      isInvalid: false,
      validName: rawCostPricePatternTypeJapaneseName
    };

  }

}


export namespace CommonJapaneseNamingValidator {

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
      notExists = "COMMON_JAPANESE_NAMING-NOT_EXISTS",

      /** @description 定義されてはいるが、文字列にはなっていない */
      existsButNotString = "COMMON_JAPANESE_NAMING-EXISTS_BUT_NOT_STRING",

      /** @description 文字列になっているが、空文字 */
      stringButEmpty = "COMMON_JAPANESE_NAMING-STRING_BUT_EMPTY",

      /** @description 不正文字発見 */
      invalidCharacters = "COMMON_JAPANESE_NAMING-INVALID_CHARACTERS"

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
