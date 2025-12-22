import { computeCostPricePatternCode } from "../../src";
import Testing from "node:test";
import Assert from "assert";


Testing.suite(
  "computeCostPricePatternCode",
  async (): Promise<void> => {

    await Promise.all(
      [
        {
          hasAtLeastOneModelCategoryType: true,
          hasAtLeastOneWholesalesCategory: false,
          hasAtLeastOneRetailCategory: false,
          result: "A"
        },
        {
          hasAtLeastOneModelCategoryType: false,
          hasAtLeastOneWholesalesCategory: true,
          hasAtLeastOneRetailCategory: false,
          result: "B"
        },
        {
          hasAtLeastOneModelCategoryType: false,
          hasAtLeastOneWholesalesCategory: false,
          hasAtLeastOneRetailCategory: true,
          result: "C"
        },
        {
          hasAtLeastOneModelCategoryType: true,
          hasAtLeastOneWholesalesCategory: true,
          hasAtLeastOneRetailCategory: false,
          result: "D"
        },
        {
          hasAtLeastOneModelCategoryType: true,
          hasAtLeastOneWholesalesCategory: false,
          hasAtLeastOneRetailCategory: true,
          result: "E"
        },
        {
          hasAtLeastOneModelCategoryType: false,
          hasAtLeastOneWholesalesCategory: true,
          hasAtLeastOneRetailCategory: true,
          result: "F"
        },
        {
          hasAtLeastOneModelCategoryType: true,
          hasAtLeastOneWholesalesCategory: true,
          hasAtLeastOneRetailCategory: true,
          result: "G"
        }
      ].map(
        async (
          {
            hasAtLeastOneModelCategoryType,
            hasAtLeastOneWholesalesCategory,
            hasAtLeastOneRetailCategory,
            result: expectedResult
          }: Readonly<{
            hasAtLeastOneModelCategoryType: boolean;
            hasAtLeastOneWholesalesCategory: boolean;
            hasAtLeastOneRetailCategory: boolean;
            result: string;
          }>
        ): Promise<void> => Testing.test(
          `パターン${ expectedResult }が正しく算出された`,
            (): void => Assert.strictEqual(
              computeCostPricePatternCode({
                hasAtLeastOneModelCategoryType,
                hasAtLeastOneWholesalesCategory,
                hasAtLeastOneRetailCategory
              }),
              expectedResult
            )
        )
      )
    );

  }
).catch((error: unknown): void => { console.error(error); });
