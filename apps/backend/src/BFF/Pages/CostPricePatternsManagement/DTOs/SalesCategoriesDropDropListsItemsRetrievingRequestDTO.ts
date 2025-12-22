import {
  CostPricePatternsManagementPageBFF,
  CostPricePatternsManagementPageTransactions,
  TagsOfSupportedLanguages,
} from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


export default class SalesCategoriesDropDropListsItemsRetrievingRequestDTO implements
    CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.RequestParameters
{

  @ClassTransformer.Expose({
    name: CostPricePatternsManagementPageTransactions.TableDataRetrieving.QueryParametersKeys.languageTag
  })
  @ClassValidator.IsString()
  @ClassValidator.IsEnum(TagsOfSupportedLanguages)
  public readonly languageTag: TagsOfSupportedLanguages;

}
