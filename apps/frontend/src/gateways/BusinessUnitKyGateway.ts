import {
  type BusinessUnit,
  type BusinessUnitGateway,
  BusinessUnitTransactions,
} from "@pxa-re-management/shared";
import { api as KyClient } from "@/utils/api-client.ts";


export default class BusinessUnitKyGateway implements BusinessUnitGateway {

  public async retrieveAll(): Promise<Array<BusinessUnit>> {
    return KyClient.get<Array<BusinessUnit>>(BusinessUnitTransactions.RetrievingOfAll.URI_PATH).json();
  }

}
