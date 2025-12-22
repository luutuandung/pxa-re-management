export namespace CostPricePatternsManagementPageTransactions {

  export const URI_PATH_PREFIX: string = "pages/cost_price_patterns_management";

  export namespace TableDataRetrieving {

    export const URI_PATH_SPECIFIC_PART: string = "table";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

    export enum QueryParametersKeys {
      businessUnitID = "business_unit_id",
      costPriceVersionID = "cost_price_version_id",
      languageTag = "language_tag"
    }

  }

  export namespace CostPricesPatternsListItemsRetrieving {

    export const URI_PATH_SPECIFIC_PART: string = "cost_prices_patterns_list";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

    export enum QueryParametersKeys {
      businessUnitID = "business_unit_id",
      languageTag = "language_tag"
    }

  }

  export namespace DropDropListsItemsRetrieving {

    export const URI_PATH_INFIX: string = "drop_down_lists";

    export namespace ModelCategoriesTypes {

      export const URI_PATH_SPECIFIC_PART: string = `${ URI_PATH_INFIX }/model_categories_types`;
      export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

      export enum QueryParametersKeys {
        businessUnitID = "business_unit_id",
        languageTag = "language_tag"
      }

    }

    export namespace SalesCategories {

      export const URI_PATH_SPECIFIC_PART: string = `${ URI_PATH_INFIX }/sales_categories`;
      export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;

      export enum QueryParametersKeys {
        languageTag = "language_tag"
      }

    }

  }

  export namespace RegisteringOfCostPricesForAllPairwiseCategoriesCombinations {
    export const URI_PATH_SPECIFIC_PART: string = "register_cost_prices";
    export const URI_PATH: string = `${ URI_PATH_PREFIX }/${ URI_PATH_SPECIFIC_PART }`;
  }

}
