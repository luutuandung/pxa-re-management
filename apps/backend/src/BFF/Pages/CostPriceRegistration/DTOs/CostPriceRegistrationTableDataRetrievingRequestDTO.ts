import {
  CostPriceRegistrationPageBFF,
  CostPriceRegistrationPageTransactions,
  TagsOfSupportedLanguages
} from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


export default class CostPriceRegistrationTableDataRetrievingRequestDTO implements
    CostPriceRegistrationPageBFF.TableDataRetrieving.RequestParameters
{

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  @ClassTransformer.Expose({
    name: CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.businessUnitID
  })
  public readonly businessUnitID: string;

  @ClassTransformer.Expose({
    name: CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.costPriceVersionID
  })
  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public readonly costPriceVersionID: string;

  @ClassTransformer.Expose({
    name: CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.costPricePatternID
  })
  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  @ClassValidator.IsOptional()
  public readonly costPricePatternID?: string;

  @ClassTransformer.Expose({
    name: CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.languageTag
  })
  @ClassValidator.IsString()
  @ClassValidator.IsEnum(TagsOfSupportedLanguages)
  public readonly languageTag: TagsOfSupportedLanguages;

}
