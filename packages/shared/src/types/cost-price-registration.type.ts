/** @description 【日本語名】 原価登録 */
export type CostPriceRegistration = {

  /** @description 【日本語名】 （原価登録パターン種類）の識別子 */
  costRegisterId: string;

  /** @description 【日本語名】 *** */
  buCostItemId: string;

  /**
   * @description 【日本語名】 原価種類
   * 全体的に３種類が存在ているが、原価登録に対しては額（G）かレート（R）のみあり得る。
   * */
  costType: CostPriceRegistration.CostPriceTypes;

  /** @description 【日本語名】 原価登録パターン明細の識別子 */
  costPatternDetailId: string;

  /** @description 【日本語名】 原価バージョンの識別子 */
  costVersionId: string;

  /** @description 【日本語名】 データ登録者のユーザーID */
  createdBy: string;

  /** @description 【日本語名】 データ登録日時 */
  createdOn: string;

  /** @description 【日本語名】 データ更新者のユーザーID */
  modifiedBy: string;

  /** @description 【日本語名】 データ更新日時 */
  modifiedOn: string;

  /** @description 【日本語名】 事業部ID */
  businessunitId: string;

};


export namespace CostPriceRegistration {

  export enum CostPriceTypes {
    amount = "G",
    rate = "R"
  }

  export function isValidCostPriceType(costPriceType: string): costPriceType is CostPriceTypes {
    return Object.values<string>(CostPriceTypes).includes(costPriceType);
  }

}
