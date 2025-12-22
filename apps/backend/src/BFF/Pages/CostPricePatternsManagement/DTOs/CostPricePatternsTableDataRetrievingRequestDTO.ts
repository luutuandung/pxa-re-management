import {
  CostPricePatternsManagementPageBFF,
  CostPricePatternsManagementPageTransactions,
  TagsOfSupportedLanguages,
} from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


export default class CostPricePatternsTableDataRetrievingRequestDTO implements
    CostPricePatternsManagementPageBFF.TableDataRetrieving.RequestParameters
{

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  @ClassTransformer.Expose({
    name: CostPricePatternsManagementPageTransactions.TableDataRetrieving.QueryParametersKeys.businessUnitID
  })
  public readonly businessUnitID: string;

  @ClassTransformer.Expose({
    name: CostPricePatternsManagementPageTransactions.TableDataRetrieving.QueryParametersKeys.costPriceVersionID
  })
  @ClassValidator.IsOptional()
  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public readonly costPriceVersionID: string;

  @ClassTransformer.Expose({
    name: CostPricePatternsManagementPageTransactions.TableDataRetrieving.QueryParametersKeys.languageTag
  })
  @ClassValidator.IsString()
  @ClassValidator.IsEnum(TagsOfSupportedLanguages)
  public readonly languageTag: TagsOfSupportedLanguages;

}
