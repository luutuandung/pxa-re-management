import {
  CurrencyGateway,
  CurrencyTransactions,
} from "@pxa-re-management/shared";
import { api as KyClient } from "@/utils/api-client.ts";


export default class CurrencyKyGateway implements CurrencyGateway {

  public async retrieveCodesOfAvailableOnes(): Promise<Array<string>> {
    return KyClient.get<Array<string>>(CurrencyTransactions.RetrievingOfCodesOfAvailableOnes.URI_PATH).json();
  }

}
