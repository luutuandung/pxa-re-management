import {
  type CostPriceRegistration,
  CostPriceRegistrationPageBFF,
  CostPriceRegistrationPageTransactions
} from "@pxa-re-management/shared";
import { api as KyClient } from "@/utils/api-client.ts";


export default class CostPriceRegistrationPageKyBFF implements CostPriceRegistrationPageBFF {

  public async retrieveTableData(
    {
      businessUnitID,
      costPriceVersionID,
      costPricePatternID,
      languageTag
    }: CostPriceRegistrationPageBFF.TableDataRetrieving.RequestParameters
  ): Promise<CostPriceRegistrationPageBFF.TableData> {
    return KyClient.get<CostPriceRegistrationPageBFF.TableData>(
      CostPriceRegistrationPageTransactions.TableDataRetrieving.URI_PATH,
      {
        searchParams: {
          [CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.businessUnitID]: businessUnitID,
          [CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.costPriceVersionID]: costPriceVersionID,
          ...typeof costPricePatternID === "string" ?
              {
                [CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.costPricePatternID]:
                    costPricePatternID
              } :
              null,
          [CostPriceRegistrationPageTransactions.TableDataRetrieving.QueryParametersKeys.languageTag]: languageTag
        }
      }
    ).json();
  }

  public async retrieveCostPricePatternsDropDownListItems(
    {
      businessUnitID,
      costPriceVersionID,
      costPricesTypes,
      languageTag
    }: CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.RequestParameters
  ): Promise<CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData> {
    return KyClient.get<CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData>(
      CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.URI_PATH,
      {
        searchParams: new URLSearchParams([
          [
            CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.QueryParametersKeys.
                businessUnitID,
            businessUnitID
          ],
          [
            CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.QueryParametersKeys.
              costPriceVersionID,
            costPriceVersionID
          ],
          ...costPricesTypes.map(
            (costPriceType: CostPriceRegistration.CostPriceTypes): [ string, string ] =>
                [
                  CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.QueryParametersKeys.
                    costPricesTypes,
                  costPriceType
                ]
          ),
          [
            CostPriceRegistrationPageTransactions.CostPricePatternsDropdownListItemsRetrieving.QueryParametersKeys.
               languageTag,
           languageTag
          ]
        ])
      }
    ).json();
  }

  public async updateCostPricesValues(
    requestData: CostPriceRegistrationPageBFF.CostPriceRegistrationValuesUpdating.RequestData
  ): Promise<void> {
    await KyClient.patch(
      CostPriceRegistrationPageTransactions.CostPriceRegistrationValuesUpdating.URI_PATH,
      {
        body: JSON.stringify(requestData),
        timeout: CostPriceRegistrationPageTransactions.CostPriceRegistrationValuesUpdating.TIMEOUT__MILLISECONDS
      }
    );
  }

}
