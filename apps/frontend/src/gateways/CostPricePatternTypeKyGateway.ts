import { CostPricePatternTypeGateway, CostPricePatternTypeTransactions } from "@pxa-re-management/shared";
import { api as KyClient } from "@/utils/api-client.ts";


export default class CostPricePatternTypeKyGateway implements CostPricePatternTypeGateway {

  public async addOne(requestData: CostPricePatternTypeGateway.AddingOfOne.RequestData): Promise<void> {
    await KyClient.post(
      CostPricePatternTypeTransactions.AddingOfOne.URI_PATH,
      { body: JSON.stringify(requestData) }
    );
  }

  public async updateOne(requestData: CostPricePatternTypeGateway.UpdatingOfOne.RequestData): Promise<void> {
    await KyClient.patch(
      CostPricePatternTypeTransactions.UpdatingOfOne.URI_PATH,
      { body: JSON.stringify(requestData) }
    );
  }

}
