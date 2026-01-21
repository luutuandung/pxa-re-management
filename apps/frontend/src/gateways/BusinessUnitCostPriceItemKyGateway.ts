import {
  type BusinessUnitCostPriceItemGateway,
  BusinessUnitCostPriceItemTransactions,
} from "@pxa-re-management/shared";
import { api as KyClient } from "@/utils/api-client.ts";


export default class BusinessUnitCostPriceItemKyGateway implements BusinessUnitCostPriceItemGateway {

  public async updateMultiple(
    requestData: BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData
  ): Promise<void> {
    await KyClient.patch(
      BusinessUnitCostPriceItemTransactions.UpdatingOfMultipleOnes.URI_PATH,
      { body: JSON.stringify(requestData) }
    );
  }

  public async manageMultiple(
    requestData: BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData
  ): Promise<void> {
    await KyClient.post(
      BusinessUnitCostPriceItemTransactions.ManagementOfMultipleOnes.URI_PATH,
      { body: JSON.stringify(requestData) }
    );
  }

  public async retrieveExistingDatesByItemIDs(
    _itemIDs: ReadonlyArray<string>
  ): Promise<ReadonlyMap<string, Readonly<{
    startingYearAndMonth__YYYYMM: string;
    endingYearAndMonth__YYYYMM: string | null;
  }>>> {
    throw new Error("retrieveExistingDatesByItemIDsはフロントエンドから呼び出してはいけません");
  }

}
