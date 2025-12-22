import { type CostPricesPatternsCategoriesDataTypes } from "../constants/CostPricesPatternsCategoriesDataTypes";


export interface CostPricePatternTypeGateway {

  addOne: (requestData: CostPricePatternTypeGateway.AddingOfOne.RequestData) => Promise<void>;

  updateOne: (requestData: CostPricePatternTypeGateway.UpdatingOfOne.RequestData) => Promise<void>;

}


export namespace CostPricePatternTypeGateway {

  export namespace AddingOfOne {

    export type RequestData = Readonly<{
      costPricePatternNames: RequestData.CostPricePatternNames;
      costPricePatternCategories: ReadonlyArray<RequestData.CostPricePatternCategory>;
      businessUnitID: string;
    }>;

    export namespace RequestData {

      export type CostPricePatternNames = Readonly<{
        japanese: string;
        english: string;
        chinese: string;
      }>;

      export type CostPricePatternCategory = Readonly<{
        typeID: string;
        dataType: CostPricesPatternsCategoriesDataTypes;
        sequenceNumber: number;
      }>;

    }

  }

  export namespace UpdatingOfOne {

    export type RequestData = Readonly<{
      costPricePatternID: string;
      costPricePatternNames: RequestData.CostPricePatternNames;
    }>;

    export namespace RequestData {
      export type CostPricePatternNames = Readonly<{
        japanese: string;
        english: string;
        chinese: string;
      }>;
    }

  }

}
