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

      /* 【 仕様書 】 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/53 */
      if (
        new RegExp(
          [
            "[",

            /* C0制御文字とDEL */
            "\\u{0000}-\\u{001F}",
            "\\u{007F}",

            /* C1制御文字 */
            "\\u{0080}-\\u{009F}",

            /* 結合ダイアクリティカルマーク */
            "\\u{0300}-\\u{036F}",

            /* 結合ダイアクリティカルマーク拡張 */
            "\\u{1AB0}-\\u{1AFF}",

            /* 結合ダイアクリティカルマーク補足 */
            "\\u{1DC0}-\\u{1DFF}",

            /* 囲み英数字補足 */
            "\\u{1F100}-\\u{1F1FF}",

            /* 囲み表意補足 */
            "\\u{1F200}-\\u{1F2FF}",

            /* 絵文字（その他記号・ピクトグラム） */
            "\\u{1F300}-\\u{1F5FF}",

            /* 絵文字（顔文字） */
            "\\u{1F600}-\\u{1F64F}",

            /* 絵文字（交通・地図記号） */
            "\\u{1F680}-\\u{1F6FF}",

            /* 絵文字（補足記号・ピクトグラム） */
            "\\u{1F900}-\\u{1F9FF}",

            /* 絵文字（拡張ピクトグラム） */
            "\\u{1FA70}-\\u{1FAFF}",

            /* ゼロ幅および双方向マーク */
            "\\u{200B}-\\u{200F}",

            /* 双方向埋め込み/上書き */
            "\\u{202A}-\\u{202E}",

            /* 不可視フォーマット制御 */
            "\\u{2060}-\\u{206F}",

            /* 記号用結合ダイアクリティカルマーク */
            "\\u{20D0}-\\u{20FF}",

            /* Number Forms（ローマ数字） */
            "\\u{2150}-\\u{218F}",

            /*  囲み英数字（丸数字など） */
            "\\u{2460}-\\u{24FF}",

            /* 絵文字（記号） */
            "\\u{2600}-\\u{26FF}",

            /* 絵文字（装飾記号） */
            "\\u{2700}-\\u{27BF}",

            /* 囲みCJK文字・月 */
            "\\u{3200}-\\u{32FF}",

            /* CJK互換（単位記号など） */
            "\\u{3300}-\\u{33FF}",

            /* サロゲート */
            "\\u{D800}-\\u{DFFF}",

            /* 私用領域（BMP） */
            "\\u{E000}-\\u{F8FF}",

            /* バリアントセレクタ補足 */
            "\\u{E0100}-\\u{E01EF}",

            /* 私用領域（補助面） */
            "\\u{F0000}-\\u{FFFFD}",
            "\\u{100000}-\\u{10FFFD}",

            /* 非文字 */
            "\\u{FDD0}-\\u{FDEF}",

            /* バリアントセレクタ */
            "\\u{FE00}-\\u{FE0F}",

            /* CJK互換フォーム */
            "\\u{FE30}-\\u{FE4F}",

            /* Specials（置換文字含む） */
            "\\u{FFF0}-\\u{FFFF}",

            /* 非文字（面末尾） */
            "\\u{FFFE}",
            "\\u{FFFF}",
            "\\u{1FFFE}-\\u{10FFFF}",

            "]"
          ].join(""),
          "u"
        ).test(character)
      ) {
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
