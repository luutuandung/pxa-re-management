export type CostPriceVersion = {

  /** @description 【日本語名】（原価バージョン）の識別子  */
  costVersionId: string;

  /** @description 【日本語名】　原価バージョン名 */
  costVersionName: string;

  /** @description 【日本語名】　適用開始年月、YYYYMM形式(例: 202404) */
  startDate: string;

  /** @description 【日本語名】　適用終了年月、YYYYMM形式(例: 202503) */
  endDate: string;

  /** @description 【日本語名】　説明　*/
  description: string;

  /** @description 【日本語名】 データ登録者のユーザーID　*/
  createdBy: string;

  /** @description 【日本語名】 データ登録日時 */
  createdOn: Date;

  /** @description 【日本語名】 データ更新者のユーザーID　*/
  modifiedBy: string;

  /** @description 【日本語名】 データ更新日時　*/
  modifiedOn: Date;

  /** @description 【日本語名】 事業部ID　*/
  businessunitId: string;

};
