import {
  CostPricePatternsManagementPageBFF,
  CostPricePatternsManagementPageTransactions,
  TagsOfSupportedLanguages,
} from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


export default class ModelCategoriesTypesDropDropListsItemsRetrievingRequestDTO implements
    CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.RequestParameters
{

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  @ClassTransformer.Expose({
    name: CostPricePatternsManagementPageTransactions.TableDataRetrieving.QueryParametersKeys.businessUnitID
  })
  public readonly businessUnitID: string;

  @ClassTransformer.Expose({
    name: CostPricePatternsManagementPageTransactions.TableDataRetrieving.QueryParametersKeys.languageTag
  })
  @ClassValidator.IsString()
  @ClassValidator.IsEnum(TagsOfSupportedLanguages)
  public readonly languageTag: TagsOfSupportedLanguages;

}
