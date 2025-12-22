import type { CostPriceRegistration } from "../../types/cost-price-registration.type";
import type { TagsOfSupportedLanguages } from "../../constants/TagsOfSupportedLanguages";
import type { CodesOfAvailableCurrencies } from "../../constants/CodesOfAvailableCurrencies";


export interface CostPriceRegistrationPageBFF {

  retrieveTableData:
      (requestParameters: CostPriceRegistrationPageBFF.TableDataRetrieving.RequestParameters) =>
          Promise<CostPriceRegistrationPageBFF.TableDataRetrieving.ResponseData>;

  retrieveCostPricePatternsDropDownListItems:
      (requestParameters: CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.RequestParameters) =>
          Promise<CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData>;

  updateCostPricesValues:
      (requestData: CostPriceRegistrationPageBFF.CostPriceRegistrationValuesUpdating.RequestData) => Promise<void>;

}


export namespace CostPriceRegistrationPageBFF {

  /* ━━━ Table Data ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export namespace TableDataRetrieving {

    export type RequestParameters = Readonly<{
      businessUnitID: string;
      costPriceVersionID: string;
      costPricePatternID?: string;
      languageTag: TagsOfSupportedLanguages;
    }>;

    export type ResponseData = TableData;

  }

  export type TableData = Readonly<{
    rows: Array<TableData.Row>;
    presentPriceTypes: Array<CostPriceRegistration.CostPriceTypes>;
  }>;

  export namespace TableData {

    export type Row = Readonly<{
      costPriceRegisterID: string;
      businessUnitCostPriceCode: string;
      businessUnitCostPriceLocalizedName: string;
      costPriceType: CostPriceRegistration.CostPriceTypes;
      currencyCode: CodesOfAvailableCurrencies;
      costPricePatternLocalizedName?: string;
      formattedModelCategoriesNames: string;
      formattedSalesDestinations: string;
      formattedResellingDestinations: string;
      startYearAndMonth__YYYYMM?: string;
      costPriceAmount?: number;
    }>;

  }


  /* ━━━ Cost Price Patterns Drop Down List Items ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export namespace CostPricePatternsDropDownListItemsRetrieving {

    export type RequestParameters = Readonly<{
      businessUnitID: string;
      costPriceVersionID: string;
      costPricesTypes: ReadonlyArray<CostPriceRegistration.CostPriceTypes>;
      languageTag: TagsOfSupportedLanguages;
    }>;

    export type ResponseData = Array<ResponseData.Item>;

    export namespace ResponseData {
      export type Item = Readonly<{
        costPricePatternID: string;
        costPricePatternName: string;
      }>;
    }

  }


  /* ━━━ Cost Price Patterns Drop Down List Items ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export namespace CostPriceRegistrationValuesUpdating {

    export type RequestData = ReadonlyArray<RequestData.Item>;

    export namespace RequestData {
      export type Item = Readonly<{
        costPriceRegistrationID: string;
        costPriceRegistrationValue: number;
      }>;
    }

  }

}
