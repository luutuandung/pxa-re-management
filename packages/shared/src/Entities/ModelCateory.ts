/** @description 【日本語名】 機種カテゴリ */
export type ModelCategory = {

  /** @description 【日本語名】 （機種カテゴリ）の識別子 */
  ID: string;

  /** @description 【日本語名】 機種カテゴリ種別識別子 */
  typeID: string;

  /** @description 【日本語名】 機種カテゴリコード */
  code: string;

  /** @description 【日本語名】 名前。日本語のみの場合がある。 */
  name: string;

  /** @description 【日本語名】 親機種カテゴリの識別子 */
  parentModelCategoryID?: string;

  /** @description 【日本語名】 並び順 */
  sequenceNumber: number;

  /** @description 【日本語名】 言語の識別子 */
  languageID: string;

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
