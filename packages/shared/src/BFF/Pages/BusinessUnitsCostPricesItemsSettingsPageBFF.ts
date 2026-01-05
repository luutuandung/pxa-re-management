import type { TagsOfSupportedLanguages } from "../../constants/TagsOfSupportedLanguages";


export interface BusinessUnitsCostPricesItemsSettingsPageBFF {

  retrieveTableData:
      (requestParameters: BusinessUnitsCostPricesItemsSettingsPageBFF.TableDataRetrieving.RequestParameters) =>
          Promise<BusinessUnitsCostPricesItemsSettingsPageBFF.TableDataRetrieving.ResponseData>;

}


export namespace BusinessUnitsCostPricesItemsSettingsPageBFF {

  export namespace TableDataRetrieving {

    export type RequestParameters = Readonly<{
      businessUnitID: string;
      languageTag: TagsOfSupportedLanguages;
      searchingByFullOrPartialBusinessUnitCostPriceName?: string;
    }>;

    export type ResponseData = TableData;

  }

  export type TableData = ReadonlyArray<TableData.Row>;

  export namespace TableData {

     export type Row = Readonly<{
       businessUnitCostPriceItemID: string;
       businessUnitCostPriceCodeID: string;
       businessUnitCostPriceItemCode: string;
       businessUnitCostPriceItemLocalizedName: string;
       yearAndMonthOfActualityStarting: Row.YearAndMonthData;
       yearAndMonthOfActualityEnding: Row.YearAndMonthData | null;
       currencyCode: string;
       isAmountValid: boolean;
       isRateValid: boolean;
       isCalculationValid: boolean;
       isDataLinkageAvailable: boolean;
    }>;

    export namespace Row {
      export type YearAndMonthData = Readonly<{
        year: number;
        monthNumber__numerationFrom1: number;
        monthNumber__numerationFrom1__always2Digits: string;
      }>;
     }

  }

}
