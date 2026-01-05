import * as ClassValidator from "class-validator";

/**
 * @description
 * 一段階目のバリデーション専用。深いバリデーションをフロントエンド側に合わせて、BusinessUnitsCostPricesItemsDataValidatorで行う事。
 * */
export default class BusinessUnitCostPriceItemManagementRequestDTO {

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public readonly businessUnitID: string;

  @ClassValidator.IsArray()
  @ClassValidator.IsObject({ each: true })
  public readonly newItems: ReadonlyArray<Readonly<{ [key: string]: unknown; }>>;

  @ClassValidator.IsArray()
  @ClassValidator.IsObject({ each: true })
  public readonly updatedItems: ReadonlyArray<Readonly<{ [key: string]: unknown; }>>;

}
