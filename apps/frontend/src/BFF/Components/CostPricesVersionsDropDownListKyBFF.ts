import {
  CostPricesVersionsDropDownListBFF,
  CostPriceVersionsDropDownListTransactions,
} from "@pxa-re-management/shared";
import { api as KyClient } from "@/utils/api-client.ts";


export default class CostPricesVersionsDropDownListKyBFF implements CostPricesVersionsDropDownListBFF {

  public async retrieveItems(
    { businessUnitID }: CostPricesVersionsDropDownListBFF.ItemsRetrieving.RequestParameters
  ): Promise<CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData> {
    return KyClient.
        get<CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData>(
          CostPriceVersionsDropDownListTransactions.ItemsRetrieving.URI_PATH,
          {
            searchParams: {
              [CostPriceVersionsDropDownListTransactions.ItemsRetrieving.QueryParametersKeys.businessUnitID]: businessUnitID
            }
          }
        ).
        json();
  }

}
