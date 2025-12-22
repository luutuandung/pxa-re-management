import { CostPricePatternsManagementPageBFF, CostPriceRegistration } from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


class RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO implements
    CostPricePatternsManagementPageBFF.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.RequestData
{

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public readonly businessUnitID: string;

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public readonly costPriceVersionID: string;

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public readonly costPricePatternID: string;

  @ClassValidator.IsArray()
  @ClassValidator.ValidateNested({ each: true })
  @ClassTransformer.Type(
    (): typeof RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO.BusinessUnitCostItem =>
        RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO.BusinessUnitCostItem
  )
  public readonly businessUnitsCostItems: ReadonlyArray<
    RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO.BusinessUnitCostItem
  >;

}


namespace RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO {

  export class BusinessUnitCostItem implements
      CostPricePatternsManagementPageBFF.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.RequestData.
          BusinessUnitCostItem
  {

    @ClassValidator.IsString()
    @ClassValidator.MinLength(1)
    public readonly ID: string;

    @ClassValidator.IsString()
    @ClassValidator.IsEnum(CostPriceRegistration.CostPriceTypes)
    public readonly costPriceType: CostPriceRegistration.CostPriceTypes;

  }

}


export default RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO;
