export namespace CostPriceVersionsDropDownListTransactions {

  export const URI_PATH_PREFIX: string = "components/cost_price_versions_drop_down_list";

  export namespace ItemsRetrieving {

    export const URI_PATH_SPECIFIC_PART: string = "items";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

    export enum QueryParametersKeys {
      businessUnitID = "business_unit_id"
    }

  }

}
