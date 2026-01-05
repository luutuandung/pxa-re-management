import type { CostPriceRegistration } from "../../types/cost-price-registration.type";
import type { TagsOfSupportedLanguages } from "../../constants/TagsOfSupportedLanguages";


export interface CostPricePatternsManagementPageBFF {

  retrieveTableData:
      (requestParameters: CostPricePatternsManagementPageBFF.TableDataRetrieving.RequestParameters) =>
          Promise<CostPricePatternsManagementPageBFF.TableDataRetrieving.ResponseData>;

  retrieveCostPricesPatternsTypesListItems:
      (requestParameters: CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.RequestParameters) =>
          Promise<CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData>;

  retrieveModelCategoriesTypesDropDownListItems:
      (
        requestParameters:
            CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.RequestParameters
      ) =>
          Promise<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.ResponseData>;

  retrieveSalesCategoriesDropDownListItems:
      (
        requestParameters: CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.RequestParameters
      ) =>
          Promise<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.ResponseData>;

  registerCostPricesForAllPairwiseCategoriesCombinations:
      (
        requestData:
            CostPricePatternsManagementPageBFF.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.RequestData
      ) =>
          Promise<void>;

}


export namespace CostPricePatternsManagementPageBFF {

  /* ━━━ Table Data ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export namespace TableDataRetrieving {

    export type RequestParameters = Readonly<{
      businessUnitID: string;
      costPriceVersionID: string;
      languageTag: TagsOfSupportedLanguages;
    }>;

    export type ResponseData = TableData;

  }

  export type TableData = ReadonlyArray<TableData.Row>;

  export namespace TableData {

    /* 【 ユニックな組み合わせ 】 businessUnitCode + costPriceType + currencyCode */
    export type Row = Readonly<{
      businessUnitCostItemID: string;
      businessUnitCode: string;
      businessUnitLocalizedName: string;
      costPriceType: CostPriceRegistration.CostPriceTypes;
      currencyCode: string;
      costPricePatternLocalizedName?: string;
    }>;

  }


  export namespace CostPricesPatternsTypesListItemsRetrieving {

    export type RequestParameters = Readonly<{
      businessUnitID: string;
    }>;

    export type ResponseData = Array<ResponseData.Item>;

    export namespace ResponseData {

      export type Item = Readonly<{
        costPricePatternID: string;
        costPricePatternNames: Item.CostPricePatternNames;
        orderedPricesPatternsCategories: Item.OrderedPricesPatternsCategoriesData;
        costPriceRegistrationPatternTypesIDs: ReadonlyArray<string>;
      }>;

      export namespace Item {

        export type CostPricePatternNames = Readonly<{
          japanese: string;
          english: string;
          chinese: string;
        }>;

        export type OrderedPricesPatternsCategoriesData = Readonly<{
          model: Array<OrderedPricesPatternsCategoriesData.Item>;
          sales: Array<OrderedPricesPatternsCategoriesData.Item>;
          retail: Array<OrderedPricesPatternsCategoriesData.Item>;
        }>;

        export namespace OrderedPricesPatternsCategoriesData {
          export type Item = Readonly<{
            costPricePatternCategoryID: string;
            costPricePatternCategoryTypeID: string;
          }>;
        }

      }

    }

  }


  /* ━━━ Drop Down Lists ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export namespace DropDropListsItemsRetrieving {

    export namespace ModelCategoriesTypes {

      export type RequestParameters = Readonly<{
        businessUnitID: string;
        languageTag: TagsOfSupportedLanguages;
      }>;

      export type ResponseData = Array<ResponseData.Item>;

      export namespace ResponseData {
        export type Item = Readonly<{
          modelCategoryTypeID: string;
          modelCategoryLocalizedName: string;
        }>;
      }

    }

    export namespace SalesCategories {

      export type RequestParameters = Readonly<{
        languageTag: TagsOfSupportedLanguages;
      }>;

      export type ResponseData = Array<ResponseData.Item>;

      export namespace ResponseData {
        export type Item = Readonly<{
          salesCategoryTypeID: string;
          salesCategoryLocalizedName: string;
        }>;
      }

    }

  }


  /* ━━━ Registering of Cost Prices for all Pairwise Categories Combinations ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export namespace RegisteringOfCostPricesForAllPairwiseCategoriesCombinations {

    export type RequestData = Readonly<{
      businessUnitID: string;
      costPriceVersionID: string;
      costPricePatternID: string;
      businessUnitsCostItems: ReadonlyArray<RequestData.BusinessUnitCostItem>;
    }>;

    export namespace RequestData {
      export type BusinessUnitCostItem = Readonly<{
        ID: string;
        costPriceType: CostPriceRegistration.CostPriceTypes;
      }>;
    }

  }

}
