import { type CostPricesVersionsDropDownListBFF, CostPriceVersionsDropDownListTransactions } from "@pxa-re-management/shared";
import QueryParametersKeys = CostPriceVersionsDropDownListTransactions.ItemsRetrieving.QueryParametersKeys;
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


export default class CostPricesVersionDropDownListItemsRetrievingRequestDTO implements
    CostPricesVersionsDropDownListBFF.ItemsRetrieving.RequestParameters
{

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  @ClassTransformer.Expose({ name: QueryParametersKeys.businessUnitID })
  public readonly businessUnitID: string;

}
