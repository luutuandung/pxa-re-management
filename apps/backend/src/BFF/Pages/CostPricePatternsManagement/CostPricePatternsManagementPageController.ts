/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricePatternsManagementPageBFF,

  /* ┅┅┅ Contracts ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricePatternsManagementPageTransactions

} from "@pxa-re-management/shared";

/* ┅┅┅ Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CostPricePatternsTableDataRetrievingRequestDTO from "./DTOs/CostPricePatternsTableDataRetrievingRequestDTO";
import CostPricesPatternsListItemsRetrievingRequestDTO from "./DTOs/CostPricesPatternsListItemsRetrievingRequestDTO";
import ModelCategoriesTypesDropDropListsItemsRetrievingRequestDTO from
    "./DTOs/ModelCategoriesTypesDropDropListsItemsRetrievingRequestDTO";
import SalesCategoriesDropDropListsItemsRetrievingRequestDTO from
    "./DTOs/SalesCategoriesDropDropListsItemsRetrievingRequestDTO";
import RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO from
    "./DTOs/RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as NestJS from "@nestjs/common";


@NestJS.Controller(CostPricePatternsManagementPageTransactions.URI_PATH_PREFIX)
export default class CostPricePatternsManagementPageController {

  public constructor(
    @NestJS.Inject("CostPricePatternsManagementPageBFF")
    private readonly costPriceRegistrationPageService: CostPricePatternsManagementPageBFF
  ) {}


  @NestJS.Get(CostPricePatternsManagementPageTransactions.TableDataRetrieving.URI_PATH_SPECIFIC_PART)
  public async retrieveTableData(
    @NestJS.Query() requestParameters: CostPricePatternsTableDataRetrievingRequestDTO
  ): Promise<CostPricePatternsManagementPageBFF.TableDataRetrieving.ResponseData> {
    return this.costPriceRegistrationPageService.retrieveTableData(requestParameters);
  }

  @NestJS.Get(CostPricePatternsManagementPageTransactions.CostPricesPatternsListItemsRetrieving.URI_PATH_SPECIFIC_PART)
  public async retrieveCostPricesPatternsListItems(
    @NestJS.Query() requestParameters: CostPricesPatternsListItemsRetrievingRequestDTO
  ): Promise<CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData> {
    return this.costPriceRegistrationPageService.retrieveCostPricesPatternsTypesListItems(requestParameters);
  }

  @NestJS.Get(
    CostPricePatternsManagementPageTransactions.DropDropListsItemsRetrieving.ModelCategoriesTypes.URI_PATH_SPECIFIC_PART
  )
  public async retrieveModelCategoriesTypesDropDownListItems(
    @NestJS.Query() requestParameters: ModelCategoriesTypesDropDropListsItemsRetrievingRequestDTO
  ): Promise<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.ResponseData> {
    return this.costPriceRegistrationPageService.retrieveModelCategoriesTypesDropDownListItems(requestParameters);
  }

  @NestJS.Get(
    CostPricePatternsManagementPageTransactions.DropDropListsItemsRetrieving.SalesCategories.URI_PATH_SPECIFIC_PART
  )
  public async retrieveSalesCategoriesDropDownListItems(
    @NestJS.Query() requestParameters: SalesCategoriesDropDropListsItemsRetrievingRequestDTO
  ): Promise<CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.ResponseData> {
    return this.costPriceRegistrationPageService.retrieveSalesCategoriesDropDownListItems(requestParameters);
  }

  @NestJS.Post(
    CostPricePatternsManagementPageTransactions.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.
        URI_PATH_SPECIFIC_PART
  )
  public async registerCostPricesForAllPairwiseCategoriesCombinations(
    @NestJS.Body() requestData: RegisteringOfCostPricesForAllPairwiseCategoriesCombinationsRequestDTO
  ): Promise<void> {
    return this.costPriceRegistrationPageService.registerCostPricesForAllPairwiseCategoriesCombinations(requestData);
  }

}
