import { CostPricePatternsManagementPageBFF, CostPricePatternsManagementPageTransactions } from "@pxa-re-management/shared";
import TableDataRetrievingTransaction = CostPricePatternsManagementPageTransactions.TableDataRetrieving;
import CostPricesPatternsListItemsRetrievingTransaction =
    CostPricePatternsManagementPageTransactions.CostPricesPatternsListItemsRetrieving;
import { api as KyClient } from "@/utils/api-client.ts";


export default class CostPricePatternsManagementPageKyBFF implements CostPricePatternsManagementPageBFF {

  public async retrieveTableData(
    {
      businessUnitID,
      costPriceVersionID,
      languageTag
    }: CostPricePatternsManagementPageBFF.TableDataRetrieving.RequestParameters
  ): Promise<CostPricePatternsManagementPageBFF.TableData> {
    return KyClient.
        get<CostPricePatternsManagementPageBFF.TableData>(
          TableDataRetrievingTransaction.URI_PATH,
          {
            searchParams: {
              [TableDataRetrievingTransaction.QueryParametersKeys.businessUnitID]: businessUnitID,
              [TableDataRetrievingTransaction.QueryParametersKeys.costPriceVersionID]: costPriceVersionID,
              [TableDataRetrievingTransaction.QueryParametersKeys.languageTag]: languageTag
            }
          }
        ).
        json();
  }

  public async retrieveCostPricesPatternsTypesListItems(
    {
      businessUnitID
    }: CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.RequestParameters
  ): Promise<CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData>{
    return KyClient.
        get<CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData>(
          CostPricesPatternsListItemsRetrievingTransaction.URI_PATH,
          {
            searchParams: {
              [CostPricesPatternsListItemsRetrievingTransaction.QueryParametersKeys.businessUnitID]: businessUnitID
            }
          }
        ).
        json();
  }

  public async retrieveModelCategoriesTypesDropDownListItems(
    {
      businessUnitID,
      languageTag
    }: CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.RequestParameters
  ): Promise<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.ResponseData> {
    return KyClient.
        get<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.ResponseData>(
          CostPricePatternsManagementPageTransactions.DropDropListsItemsRetrieving.ModelCategoriesTypes.URI_PATH,
          {
            searchParams: {
              [
                CostPricePatternsManagementPageTransactions.DropDropListsItemsRetrieving.ModelCategoriesTypes.
                  QueryParametersKeys.businessUnitID
              ]: businessUnitID,
              [
                CostPricePatternsManagementPageTransactions.DropDropListsItemsRetrieving.ModelCategoriesTypes.
                  QueryParametersKeys.languageTag
              ]: languageTag
            }
          }
        ).
        json();
  }

  public async retrieveSalesCategoriesDropDownListItems(
    { languageTag }: CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.RequestParameters
  ): Promise<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.ResponseData> {
    return KyClient.
        get<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.ResponseData>(
          CostPricePatternsManagementPageTransactions.DropDropListsItemsRetrieving.SalesCategories.URI_PATH,
          {
            searchParams: {
              [
                CostPricePatternsManagementPageTransactions.DropDropListsItemsRetrieving.SalesCategories.
                  QueryParametersKeys.languageTag
              ]: languageTag
            }
          }
        ).
        json();
  }

  public async registerCostPricesForAllPairwiseCategoriesCombinations(
    requestData: CostPricePatternsManagementPageBFF.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.RequestData
  ): Promise<void> {
    await KyClient.post(
      CostPricePatternsManagementPageTransactions.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.URI_PATH,
      { body: JSON.stringify(requestData) }
    );
  }

  public async unregisterCostPricesForAllPairwiseCategoriesCombinations(
    requestData: CostPricePatternsManagementPageBFF.UnregisteringOfCostPricesForAllPairwiseCategoriesCombinations.RequestData
  ): Promise<void> {
    await KyClient.post(
      CostPricePatternsManagementPageTransactions.UnregisteringOfCostPricesForAllPairwiseCategoriesCombinations.URI_PATH,
      { body: JSON.stringify(requestData) }
    );
  }
}
