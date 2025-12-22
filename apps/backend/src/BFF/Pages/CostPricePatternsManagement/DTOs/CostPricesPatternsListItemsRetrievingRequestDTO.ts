import {
  type CostPricePatternsManagementPageBFF,
  CostPricePatternsManagementPageTransactions
} from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


export default class CostPricesPatternsListItemsRetrievingRequestDTO implements
    CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.RequestParameters
{

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  @ClassTransformer.Expose({
    name: CostPricePatternsManagementPageTransactions.CostPricesPatternsListItemsRetrieving.QueryParametersKeys.businessUnitID
  })
  public readonly businessUnitID: string;

}
