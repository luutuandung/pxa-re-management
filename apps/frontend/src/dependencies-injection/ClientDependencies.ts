import {
  BusinessUnitGateway,
  BusinessUnitCostPriceItemGateway,
  CostPricePatternTypeGateway,
  CurrencyGateway,
  BusinessUnitsCostPricesItemsSettingsPageBFF,
  CostPricePatternsManagementPageBFF,
  CostPriceRegistrationPageBFF,
  CostPricesVersionsDropDownListBFF
} from "@pxa-re-management/shared";


type ClientDependencies = Readonly<{
  gateways: ClientDependencies.Gateways;
  BFF: ClientDependencies.BFF;
}>;


namespace ClientDependencies {

  export type Gateways = Readonly<{
    businessUnit: BusinessUnitGateway;
    businessUnitCostPriceItem: BusinessUnitCostPriceItemGateway;
    costPricePatternType: CostPricePatternTypeGateway;
    currency: CurrencyGateway;
  }>;

  export type BFF = Readonly<{
    pages: BFF.Pages;
    components: BFF.Components;
  }>;

  export namespace BFF {

    export type Pages = Readonly<{
      businessUnitsCostPricesItemsSettings: BusinessUnitsCostPricesItemsSettingsPageBFF;
      costPricePatternsManagement: CostPricePatternsManagementPageBFF;
      costPriceRegistration: CostPriceRegistrationPageBFF;
    }>;

    export type Components = Readonly<{
      costPricesVersionsDropDownList: CostPricesVersionsDropDownListBFF;
    }>;

  }

}


export default ClientDependencies;
