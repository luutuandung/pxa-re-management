import { CostPricePatternTypeGateway } from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


/** @description 一段階目のバリデーション専用。深いバリデーションをフロントエンド側に合わせて、CostPricePatternValidatorで行う事。 */
class CostPricePatternTypeUpdatingRequestDTO implements CostPricePatternTypeGateway.UpdatingOfOne.RequestData {

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public costPricePatternID: string;

  @ClassValidator.ValidateNested()
  @ClassTransformer.Type(
    (): typeof CostPricePatternTypeUpdatingRequestDTO.CostPricePatternNames =>
        CostPricePatternTypeUpdatingRequestDTO.CostPricePatternNames
  )
  public costPricePatternNames: CostPricePatternTypeUpdatingRequestDTO.CostPricePatternNames;

}


namespace CostPricePatternTypeUpdatingRequestDTO {

  export class CostPricePatternNames implements CostPricePatternTypeGateway.UpdatingOfOne.RequestData.CostPricePatternNames {

    @ClassValidator.IsString()
    public chinese: string;

    @ClassValidator.IsString()
    public english: string;

    @ClassValidator.IsString()
    public japanese: string;

  }

}


export default CostPricePatternTypeUpdatingRequestDTO;
