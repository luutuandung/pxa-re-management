export interface CurrencyGateway {

  retrieveCodesOfAvailableOnes: () => Promise<Array<string>>;

}
