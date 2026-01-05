import {
  BusinessUnitsCostPricesItemsSettingsPageBFF,
  BusinessCostPricesItemsSettingsPageTransactions,
  TagsOfSupportedLanguages
} from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


export default class BusinessUnitsCostPricesItemsSettingsTableDataRetrievingRequestDTO implements
    BusinessUnitsCostPricesItemsSettingsPageBFF.TableDataRetrieving.RequestParameters
{

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  @ClassTransformer.Expose({
    name: BusinessCostPricesItemsSettingsPageTransactions.TableDataRetrieving.QueryParametersKeys.businessUnitID
  })
  public readonly businessUnitID: string;

  @ClassTransformer.Expose({
    name: BusinessCostPricesItemsSettingsPageTransactions.TableDataRetrieving.QueryParametersKeys.languageTag
  })
  @ClassValidator.IsString()
  @ClassValidator.IsEnum(TagsOfSupportedLanguages)
  public readonly languageTag: TagsOfSupportedLanguages;

  @ClassValidator.IsString()
  @ClassValidator.IsOptional()
  @ClassValidator.MinLength(1)
  @ClassTransformer.Expose({
    name: BusinessCostPricesItemsSettingsPageTransactions.TableDataRetrieving.QueryParametersKeys.
        searchingByFullOrPartialBusinessUnitCostPriceName
  })
  public readonly searchingByFullOrPartialBusinessUnitCostPriceName?: string;

}
