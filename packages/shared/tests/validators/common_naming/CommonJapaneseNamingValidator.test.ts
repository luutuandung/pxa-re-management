import { CommonJapaneseNamingValidator } from "../../../src";
import Testing from "node:test";
import Assert from "assert"


const validSamples: ReadonlyArray<string> = [
  "例",
  "漢字のみ",
  "カタカナ",
  "ひらがな",
  "全額数字１"
];

const invalidSamples: ReadonlyArray<string> = [
  ""
];


Testing.suite(
  "CommonJapaneseNamingValidator",
  async (): Promise<void> => {

    await Promise.all([

      Testing.suite(
        "妥当な例",
        async (): Promise<void> => {

          await Promise.all(
            validSamples.map(
              async (validSample: string): Promise<void> =>
                  Testing.test(
                    `期待通り「${ validSample }」は妥当`,
                    (): void => {
                      Assert.strictEqual(CommonJapaneseNamingValidator.validate(validSample).isInvalid, false);
                    }
                  )
            )
          );

        }
      ),

      Testing.suite(
        "妥当な例",
        async (): Promise<void> => {

          await Promise.all(
            invalidSamples.map(
              async (invaliSample: string): Promise<void> =>
                  Testing.test(
                    `期待通り「${ invaliSample }」は不正`,
                    (): void => {
                      Assert.strictEqual(CommonJapaneseNamingValidator.validate(invaliSample).isInvalid, true);
                    }
                  )
            )
          );

        }
      )

    ]);

  }
).catch((error: unknown): void => { console.error(error); });
