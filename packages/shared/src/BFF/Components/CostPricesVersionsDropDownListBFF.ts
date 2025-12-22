export interface CostPricesVersionsDropDownListBFF {

  retrieveItems: (
    requestParameters: CostPricesVersionsDropDownListBFF.ItemsRetrieving.RequestParameters
  ) => Promise<CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData>;

}


export namespace CostPricesVersionsDropDownListBFF {

  export namespace ItemsRetrieving {

    export type RequestParameters = Readonly<{
      businessUnitID: string;
    }>;

    export type ResponseData = Array<ResponseData.Item>;

    export namespace ResponseData {
      export type Item = Readonly<{
        costPriceVersionID: string;
        costPriceVersionName: string;
      }>;
    }

  }

}
