export namespace CurrencyTransactions {

  export const URI_PATH_PREFIX: string = "currency";

  export namespace RetrievingOfCodesOfAvailableOnes {

    export const URI_PATH_SPECIFIC_PART: string = "codes";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

  }

}
