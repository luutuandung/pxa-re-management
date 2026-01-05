export namespace BusinessCostPricesItemsSettingsPageTransactions {

  export const URI_PATH_PREFIX: string = "pages/business_cost_prices_items_settings";

  export namespace TableDataRetrieving {

    export const URI_PATH_SPECIFIC_PART: string = "table";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

    export enum QueryParametersKeys {
      businessUnitID = "business_unit_id",
      languageTag = "language_tag",
      searchingByFullOrPartialBusinessUnitCostPriceName = "name"
    }

  }

}
