import { CostPricePatternTypeGateway } from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


/** @description 一段階目のバリデーション専用。深いバリデーションをフロントエンド側に合わせて、CostPricePatternValidatorで行う事。 */
class CostPricePatternTypeAddingRequestDTO implements CostPricePatternTypeGateway.AddingOfOne.RequestData {

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public businessUnitID: string;

  @ClassValidator.IsArray()
  @ClassValidator.ValidateNested({ each: true })
  @ClassTransformer.Type(
    (): typeof CostPricePatternTypeAddingRequestDTO.CostPricePatternCategory =>
        CostPricePatternTypeAddingRequestDTO.CostPricePatternCategory
  )
  public costPricePatternCategories: ReadonlyArray<CostPricePatternTypeAddingRequestDTO.CostPricePatternCategory>;

  @ClassValidator.ValidateNested()
  @ClassTransformer.Type(
    (): typeof CostPricePatternTypeAddingRequestDTO.CostPricePatternNames =>
        CostPricePatternTypeAddingRequestDTO.CostPricePatternNames
  )
  public costPricePatternNames: CostPricePatternTypeAddingRequestDTO.CostPricePatternNames;

}


namespace CostPricePatternTypeAddingRequestDTO {

  export class CostPricePatternCategory implements CostPricePatternTypeGateway.AddingOfOne.RequestData.CostPricePatternCategory {

    @ClassValidator.IsString()
    public typeID: string;

    @ClassValidator.IsNumber()
    public dataType: number;

    @ClassValidator.IsNumber()
    public sequenceNumber: number;

  }

  export class CostPricePatternNames implements CostPricePatternTypeGateway.AddingOfOne.RequestData.CostPricePatternNames {

    @ClassValidator.IsString()
    chinese: string;

    @ClassValidator.IsString()
    english: string;

    @ClassValidator.IsString()
    japanese: string;

  }

}


export default CostPricePatternTypeAddingRequestDTO;
