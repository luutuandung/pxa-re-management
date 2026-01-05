/* 【 方法論 】 タイプが要らない限り作らない事。タイプを削除しても、名スペースを削除・名前変更する必要はない。 */
/* export type BusinessUnitCostPriceItem = {}; */


export namespace BusinessUnitCostPriceItem {

  export type UniqueCompoundKey = string;

  export function generateCompoundKeyWhichMustBeUnique(
    {
      businessUnitCostPriceCodeID,
      currencyCode
    }: Readonly<{
      businessUnitCostPriceCodeID: string;
      currencyCode: string;
    }>
  ): string {
    return `${ businessUnitCostPriceCodeID }__${ currencyCode }`
  }

  export namespace YearOfActualityStarting {

    export const MAXIMAL_PASSED_YEARS_COUNT: number = 1;
    export const MAXIMAL_FUTURE_YEARS_COUNT: number = 2;

    export function computeEarliestOne(referenceYear: number): number {
      return referenceYear - MAXIMAL_PASSED_YEARS_COUNT;
    }

    export function computeLatestOne(referenceYear: number): number {
      return referenceYear + MAXIMAL_FUTURE_YEARS_COUNT;
    }

  }

  export namespace YearOfActualityEnding {

    export const MAXIMAL_PASSED_YEARS_COUNT: number = 0;
    export const MAXIMAL_FUTURE_YEARS_COUNT: number = 3;

    export function computeEarliestOne(referenceYear: number): number {
      return referenceYear - MAXIMAL_PASSED_YEARS_COUNT;
    }

    export function computeLatestOne(referenceYear: number): number {
      return referenceYear + MAXIMAL_FUTURE_YEARS_COUNT;
    }

  }

}
