import {
  BusinessCostPricesItemsSettingsPageTransactions,
  BusinessUnitsCostPricesItemsSettingsPageBFF
} from "@pxa-re-management/shared";
import TableDataRetrievingTransaction = BusinessCostPricesItemsSettingsPageTransactions.TableDataRetrieving;
import { api as KyClient } from "@/utils/api-client.ts";


export default class BusinessUnitsCostPricesItemsSettingsPageKyBFF implements BusinessUnitsCostPricesItemsSettingsPageBFF {

  public async retrieveTableData(
    {
      businessUnitID,
      languageTag,
      searchingByFullOrPartialBusinessUnitCostPriceName
    }: BusinessUnitsCostPricesItemsSettingsPageBFF.TableDataRetrieving.RequestParameters
  ): Promise<BusinessUnitsCostPricesItemsSettingsPageBFF.TableDataRetrieving.ResponseData> {
    return KyClient.
        get<BusinessUnitsCostPricesItemsSettingsPageBFF.TableDataRetrieving.ResponseData>(
          TableDataRetrievingTransaction.URI_PATH,
          {
            searchParams: {
              [TableDataRetrievingTransaction.QueryParametersKeys.businessUnitID]: businessUnitID,
              [TableDataRetrievingTransaction.QueryParametersKeys.languageTag]: languageTag,
              ...(searchingByFullOrPartialBusinessUnitCostPriceName?.length ?? 0) > 0 ?
                  {
                    [TableDataRetrievingTransaction.QueryParametersKeys.searchingByFullOrPartialBusinessUnitCostPriceName]:
                      searchingByFullOrPartialBusinessUnitCostPriceName
                  } :
                  null
            }
          }
        ).
        json();
  }

}
