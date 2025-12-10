import { CommonEnglishNamingValidator } from "../../../src";
import Testing from "node:test";
import Assert from "assert"


const validSamples: ReadonlyArray<string> = [
  "Latin Letters Only and Spaces",
  "Latin Letters Digits and Spaces Only 123"
];

const invalidSamples: ReadonlyArray<string> = [
  "",
  "漢字"
];


Testing.suite(
  "CommonEnglishNamingValidator",
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
                      Assert.strictEqual(CommonEnglishNamingValidator.validate(validSample).isInvalid, false);
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
                      Assert.strictEqual(CommonEnglishNamingValidator.validate(invaliSample).isInvalid, true);
                    }
                  )
            )
          );

        }
      )

    ]);

  }
).catch((error: unknown): void => { console.error(error); });
