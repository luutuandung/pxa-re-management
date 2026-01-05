export namespace BusinessUnitCostPriceItemTransactions {

  export const URI_PATH_PREFIX: string = "business_unit_cost_price_item"

  export namespace UpdatingOfMultipleOnes {
    export const URI_PATH_SPECIFIC_PART: string = "update_multiple";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;
  }

  export namespace ManagementOfMultipleOnes {
    export const URI_PATH_SPECIFIC_PART: string = "manage_multiple";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;
  }

}
