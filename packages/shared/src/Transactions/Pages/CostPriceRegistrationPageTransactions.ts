export namespace CostPriceRegistrationPageTransactions {

  export const URI_PATH_PREFIX: string = "pages/cost_price_registration";

  export namespace TableDataRetrieving {

    export const URI_PATH_SPECIFIC_PART: string = "table";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

    export enum QueryParametersKeys {
      businessUnitID = "business_unit_id",
      costPriceVersionID = "cost_price_version_id",
      costPricePatternID = "cost_price_pattern_id",
      languageTag = "lang"
    }

  }

  export namespace CostPricePatternsDropdownListItemsRetrieving {

    export const URI_PATH_SPECIFIC_PART: string = "drop_down_lists/cost_price_patterns";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

    export enum QueryParametersKeys {
      businessUnitID = "business_unit_id",
      costPriceVersionID = "cost_price_version_id",
      costPricesTypes = "cost_prices_types",
      languageTag = "lang"
    }

  }

  export namespace CostPriceRegistrationValuesUpdating {
    export const URI_PATH_SPECIFIC_PART: string = "update_cost_prices_values";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;
    export const TIMEOUT__MILLISECONDS: number = 120_000;
  }

}
