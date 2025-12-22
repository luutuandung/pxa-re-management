import {
  CostPriceRegistration,
  TagsOfSupportedLanguages,
  CostPriceRegistrationPageBFF,
  CostPriceRegistrationPageTransactions
} from "@pxa-re-management/shared";
import * as ClassValidator from "class-validator";
import * as ClassTransformer from "class-transformer";


export default class CostPricePatternsDropDownListItemsRetrievingRequestDTO implements
    CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.RequestParameters
{

  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  @ClassTransformer.Expose({
    name: CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.QueryParametersKeys.
        businessUnitID
  })
  public readonly businessUnitID: string;

  @ClassTransformer.Expose({
    name: CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.QueryParametersKeys.
        costPriceVersionID
  })
  @ClassValidator.IsString()
  @ClassValidator.MinLength(1)
  public readonly costPriceVersionID: string;

  @ClassTransformer.Transform(
    ({ value }: ClassTransformer.TransformFnParams): unknown => {
      if (typeof value === "string") {
        return [ value ];
      } else {
        return value;
      }
    }
  )
  @ClassTransformer.Expose({
    name: CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.QueryParametersKeys.
        costPricesTypes
  })
  @ClassValidator.IsArray()
  @ClassValidator.ArrayMinSize(1)
  @ClassValidator.ArrayMaxSize(Object.values(CostPriceRegistration.CostPriceTypes).length)
  @ClassValidator.ArrayUnique()
  @ClassValidator.IsIn(Object.values(CostPriceRegistration.CostPriceTypes), { each: true })
  public readonly costPricesTypes: ReadonlyArray<CostPriceRegistration.CostPriceTypes>;

  @ClassTransformer.Expose({
    name: CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.languageTag
  })
  @ClassValidator.IsString()
  @ClassValidator.IsEnum(TagsOfSupportedLanguages)
  public readonly languageTag: TagsOfSupportedLanguages;

}
