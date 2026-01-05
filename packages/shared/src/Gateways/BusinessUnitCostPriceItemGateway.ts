export interface BusinessUnitCostPriceItemGateway {

  updateMultiple: (requestData: BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData) => Promise<void>;

  manageMultiple: (requestData: BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData) => Promise<void>;

}


export namespace BusinessUnitCostPriceItemGateway {

  export namespace UpdatingOfOne {
    export type RequestData = Readonly<{
      businessUnitCostPriceItemID: string;
      startingYearAndMonth__YYYYMM: string;
      endingYearAndMonth__YYYYMM: string | null;
      currencyCode: string;
      isAmountValid: boolean;
      isRateValid: boolean;
      isCalculationValid: boolean;
      isDataLinkageAvailable: boolean;
    }>;
  }

  export namespace CreatingOfOne {
    export type RequestData =
        Omit<UpdatingOfOne.RequestData, "businessUnitCostPriceItemID"> &
        Readonly<{ businessUnitCostPriceCodeID: string; }>;

  }

  export namespace UpdatingOfMultipleOnes {

    export type RequestData = ReadonlyArray<RequestData.Item>;

    export namespace RequestData {
      export type Item = UpdatingOfOne.RequestData;
    }

  }

  export namespace ManagementOfMultipleOnes {

    export type RequestData = Readonly<{
      newItems: ReadonlyArray<ManagementOfMultipleOnes.RequestData.NewItem>;
      updatedItems: ReadonlyArray<ManagementOfMultipleOnes.RequestData.UpdatedItem>;
      businessUnitID: string;
    }>;

    export namespace RequestData {
      export type NewItem =
          CreatingOfOne.RequestData &
          Readonly<{ businessUnitCostPriceCodeID: string; }>;
      export type UpdatedItem = UpdatingOfMultipleOnes.RequestData.Item;
    }

  }

}
