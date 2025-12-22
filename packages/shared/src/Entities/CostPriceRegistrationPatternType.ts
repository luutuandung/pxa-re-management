export type CostPriceRegistrationPatternType = {

  /** @description 【日本語名】 （原価登録パターン種類）の識別子 */
  ID: string;

  /** @description 【日本語名】 事業部原価項目の識別子 */
  businessUnitCostItemID: string;

  /** @description 【日本語名】 原価種類 */
  costPriceType: string;

  /** @description 【日本語名】 原価パターン種類の識別子 */
  costPricePatternID: string;

  /** @description 【日本語名】 原価バージョンの識別子 */
  costPriceVersionID: string;

  /** @description 【日本語名】 データ登録者のユーザーID */
  creatorUserID: string;

  /** @description 【日本語名】 データ登録日時 */
  createdAt: Date;

  /** @description 【日本語名】 データ更新者のユーザーID */
  updaterUserID: string;

  /** @description 【日本語名】 データ更新日時 */
  modifiedAt: Date;

  /** @description 【日本語名】 事業部ID */
  businessUnitID: string;

};
