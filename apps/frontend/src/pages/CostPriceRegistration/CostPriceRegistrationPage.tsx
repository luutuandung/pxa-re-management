/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ Business Rules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ Entities ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  type BusinessUnit,
  CostPriceRegistration,

  /* ╍╍╍ Gateways ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  type BusinessUnitGateway,

  /* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPriceRegistrationPageBFF,
  CostPricesVersionsDropDownListBFF,

  /* ┅┅┅ Validations ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  UpdatedCostPriceRegistrationsRequestDataValidator

} from "@pxa-re-management/shared";

/* ┅┅┅ Assets ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CSS_Classes from "./CostPriceRegistrationPage.module.sass";

/* ┅┅┅ Event Bus ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { StickyMessageAtomClassComponentAdapter } from "@/store/stickyMessage.ts";

/* ┅┅┅ GUI Components ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import PageTopHeading from "@/components/atoms/PageTopHeading/PageTopHeading.tsx";
import DropDownList from "@/components/molecules/DropDownList/DropDownList.tsx";
import BusinessUnitsDropDownList from "@/components/molecules/DropDownList/Specials/BusinessUnits/BusinessUnitsDropDownList.tsx";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Alert from "@/components/molecules/Alert.tsx";
import Backdrop from "@/components/molecules/Backdrop.tsx";
import Button from "@/components/atoms/Button"

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as React from "react";
import { withTranslation } from "react-i18next";
import * as I18n from "i18next";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ClientDependenciesInjector from "@/dependencies-injection/ClientDependenciesInjector.ts";
import ExcelHelper from "@/utils/ExcelHelper.ts";
import { getTagOfCurrentLanguage } from "@/i18n";


class CostPriceRegistrationPage extends React.Component<CostPriceRegistrationPage.Props, CostPriceRegistrationPage.State> {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static readonly I18N_Namespace: string = "costPriceRegistrationPage";

  private static readonly supportedSpreadsheetsFileNameExtensionsWithLeadingDots: ReadonlyArray<string> = [ ".xlsx" ];


  /* ━━━ Non-reactive Instance Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Dependencies ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly businessUnitGateway: BusinessUnitGateway = ClientDependenciesInjector.gateways.businessUnit;

  private readonly BFF: CostPriceRegistrationPageBFF = ClientDependenciesInjector.BFF.pages.costPriceRegistration;
  private readonly costPriceVersionsDropDownListBFF: CostPricesVersionsDropDownListBFF = ClientDependenciesInjector.BFF.
      components.costPricesVersionsDropDownList;

  /* ┅┅┅ React References ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly reactReferences: Readonly<{
    excelFilePicker: React.RefObject<HTMLInputElement | null>;
    stickyMessageAtom: React.RefObject<StickyMessageAtomClassComponentAdapter.API | null>;
  }> = {
    excelFilePicker: React.createRef(),
    stickyMessageAtom: React.createRef()
  };


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public state: CostPriceRegistrationPage.State = {

    /* ┅┅┅ Filtering ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Business Units ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    businessUnits: [],
    isBusinessUnitsRetrievingInProgressOrNotStartedYet: true,
    hasBusinessUnitsRetrievingErrorOccurred: false,
    selectedBusinessUnitID: null,

    /* ╍╍╍ Cost Price Versions ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    costPriceVersionsDropDownListItems: [],
    isCostPriceVersionsDropDownListItemsRetrievingInProgress: false,
    hasCostPriceVersionsDropDownListItemsErrorOccurred: false,
    selectedCostPriceVersionID: null,

    /* ╍╍╍ Cost Register Patterns ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    costPricePatternsDropDownListItems: [],
    isCostPricePatternsDropDownListItemsRetrievingInProgress: false,
    hasCostPricePatternsDropDownListItemsRetrievingErrorOccurred: false,
    selectedCostPricePatternID: null,

    /* ┅┅┅ Table Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    tableData: null,
    hasTableDataRetrievingForCurrentFilteringNotStartedYet: true,
    isTableDataRetrievingInProgress: false,
    hasTableDataRetrievingErrorOccurred: false,

    /* ┅┅┅ Updating Data by Excel ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    validationErrorsForDataFromExcel: []

  };


  /* ━━━ Event Bus ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private get stickyMessageAtom(): StickyMessageAtomClassComponentAdapter.API {
    return this.reactReferences.stickyMessageAtom.current ??
        ((): never => { throw new Error("期待に反し、「StickyMessageAtomClassComponentAdapter」が未初期化。"); })();
  }


  /* ━━━ Lifecycle Hooks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public componentDidMount(): void {
    this.retrieveBusinessUnits().catch((error: unknown): void => { console.error(error); })
  }


  /* ━━━ Data Retrieving ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 【 整備性 】 この群のメソッドの順番を呼び出される順番通り保つ事。 */

  private async retrieveBusinessUnits(): Promise<void> {

    let businessUnits: ReadonlyArray<BusinessUnit>;

    this.setState({
      isBusinessUnitsRetrievingInProgressOrNotStartedYet: true,
      hasBusinessUnitsRetrievingErrorOccurred: false
    });

    try {

      businessUnits = await this.businessUnitGateway.retrieveAll();

    } catch (error: unknown) {

      this.setState({
        hasBusinessUnitsRetrievingErrorOccurred: true,
        isBusinessUnitsRetrievingInProgressOrNotStartedYet: false
      });

      console.error(error);

      return;

    }


    this.setState({
      businessUnits,
      isBusinessUnitsRetrievingInProgressOrNotStartedYet: false,
      hasBusinessUnitsRetrievingErrorOccurred: false
    });

  }

  /* 【 パフォーマンス最適化 】 可能な時、事業部IDを直接渡すべき。（不可能な時もあるので、引数を任意化。） */
  private async costPriceVersionsDropDownListItems(
    selectedBusinessUnitID: string | null = this.state.selectedBusinessUnitID
  ): Promise<void> {

    if (selectedBusinessUnitID === null) {
      throw new Error(
        "論理エラー：期待に反し「costPriceRegistrationPage.costPriceVersionsDropDownListItems」が呼び出された時点" +
          "「state.selectedBusinessUnitID」は未初期化。"
      );
    }


    let costPriceVersionsDropDownListItems: ReadonlyArray<CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData.Item>;

    this.setState({
      isCostPriceVersionsDropDownListItemsRetrievingInProgress: true,
      hasCostPriceVersionsDropDownListItemsErrorOccurred: false
    });

    try {

      costPriceVersionsDropDownListItems = await this.costPriceVersionsDropDownListBFF.
          retrieveItems({ businessUnitID: selectedBusinessUnitID });

    } catch (error: unknown) {

      this.setState({
        hasCostPriceVersionsDropDownListItemsErrorOccurred: true,
        isCostPriceVersionsDropDownListItemsRetrievingInProgress: false
      });

      console.error(error);

      return;

    }


    this.setState({
      costPriceVersionsDropDownListItems: costPriceVersionsDropDownListItems,
      isCostPriceVersionsDropDownListItemsRetrievingInProgress: false,
      hasBusinessUnitsRetrievingErrorOccurred: false
    });

  }

  /* 【 パフォーマンス最適化 】 可能な時、原価バージョンIDを直接渡すべき。（不可能な時もあるので、引数を任意化。） */
  private async retrieveTableData(
    {
      selectedCostPriceVersionID = this.state.selectedCostPriceVersionID,
      selectedCostPricePatternID = this.state.selectedCostPricePatternID
    }: Readonly<{
      selectedCostPriceVersionID?: string | null;
      selectedCostPricePatternID?: string | null;
    }> = {}
  ): Promise<CostPriceRegistrationPageBFF.TableData> {

    if (this.state.selectedBusinessUnitID === null || selectedCostPriceVersionID === null) {
      throw new Error(
        "論理エラー：期待に反し「CostPriceRegistrationPage.retrieveTableData」が呼び出された時点「state.selectedBusinessUnitID」か、" +
          "「selectedCostPriceVersionID」か、その両方は未初期化。"
      );
    }


    let tableData: CostPriceRegistrationPageBFF.TableData;

    this.setState({
      tableData: null,
      hasTableDataRetrievingForCurrentFilteringNotStartedYet: false,
      isTableDataRetrievingInProgress: true,
      hasTableDataRetrievingErrorOccurred: false
    });

    try {

      tableData = await this.BFF.retrieveTableData({
        businessUnitID: this.state.selectedBusinessUnitID,
        costPriceVersionID: selectedCostPriceVersionID,
        ...selectedCostPricePatternID === null ? null : { costPricePatternID: selectedCostPricePatternID },
        languageTag: getTagOfCurrentLanguage()
      });

    } catch (error: unknown) {

      this.setState({
        hasTableDataRetrievingErrorOccurred: true,
        isTableDataRetrievingInProgress: false
      });

      throw new Error("テーブルデータ取得中エラーが発生。", { cause: error });

    }


    this.setState({
      tableData,
      isTableDataRetrievingInProgress: false,
      hasTableDataRetrievingErrorOccurred: false
    });

    return tableData;

  }

  /* 【 パフォーマンス最適化 】 可能な時、事業部ID・テーブルデータを直接渡すべき。（不可能な時もあるので、引数を任意化。） */
  private async retrieveCostPricePatternsDropDownListItems(
    selectedCostPriceVersionID: string | null = this.state.selectedCostPriceVersionID,
    tableData: CostPriceRegistrationPageBFF.TableData | null = this.state.tableData
  ): Promise<void> {

    if (
      this.state.selectedBusinessUnitID === null ||
          selectedCostPriceVersionID === null ||
          tableData === null
    ) {
      throw new Error(
        "論理エラー：期待に反し「costPriceRegistrationPage.retrieveCostPricePatternsDropDownListItems」が呼び出された時点" +
          "「state.selectedBusinessUnitID」か、「selectedCostPriceVersionID」か、「tableData」か、その全部は未初期化。"
      );
    }


    let costPricePatternsDropDownListData: CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData;

    this.setState({
      isCostPricePatternsDropDownListItemsRetrievingInProgress: true,
      hasCostPricePatternsDropDownListItemsRetrievingErrorOccurred: false
    });

    try {

      costPricePatternsDropDownListData = await this.BFF.retrieveCostPricePatternsDropDownListItems({
        businessUnitID: this.state.selectedBusinessUnitID,
        costPriceVersionID: selectedCostPriceVersionID,
        costPricesTypes: tableData.presentPriceTypes,
        languageTag: getTagOfCurrentLanguage()
      });

    } catch (error: unknown) {

      this.setState({
        hasCostPricePatternsDropDownListItemsRetrievingErrorOccurred: true,
        isCostPricePatternsDropDownListItemsRetrievingInProgress: false
      });

      console.error(error);

      return;

    }

    this.setState({
      costPricePatternsDropDownListItems: costPricePatternsDropDownListData,
      isCostPricePatternsDropDownListItemsRetrievingInProgress: false,
      hasCostPricePatternsDropDownListItemsRetrievingErrorOccurred: false,
    });

  }


  /* ━━━ Actions Handling ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private onBusinessUnitItemSelected(selectedBusinessUnitID: string): void {

    this.setState({
      selectedBusinessUnitID,
      costPriceVersionsDropDownListItems: [],
      selectedCostPriceVersionID: null,
      costPricePatternsDropDownListItems: [],
      selectedCostPricePatternID: null,
      tableData: null,
      hasTableDataRetrievingForCurrentFilteringNotStartedYet: true
    });

    /* 【 理論：React 】 ステートの更新が非同期なので、this.state.selectedBusinessUnitIDを直接渡すと、エラーが発生する。 */
    this.costPriceVersionsDropDownListItems(selectedBusinessUnitID).
        catch((error: unknown): void => { console.error(error); });

  }

  private async onCostPriceVersionSelected(selectedCostPriceVersionID: string): Promise<void> {

    this.setState({
      selectedCostPriceVersionID,
      costPricePatternsDropDownListItems: [],
      selectedCostPricePatternID: null,
      tableData: null,
      hasTableDataRetrievingForCurrentFilteringNotStartedYet: true
    });

    let tableData: CostPriceRegistrationPageBFF.TableData;

    try {

      tableData = await this.retrieveTableData({ selectedCostPriceVersionID });

    } catch (error: unknown) {

      console.error(error);
      return;

    }


    if (tableData.rows.length > 0) {
      this.retrieveCostPricePatternsDropDownListItems(selectedCostPriceVersionID, tableData).
          catch((error: unknown): void => { console.error(error); })
    }

  }

  private onCostPricePatternSelected(selectedCostPricePatternID: string): void {

    const actualSelectedCostPricePatternID: string | null = 
        selectedCostPricePatternID === "__ALL__" ? null : selectedCostPricePatternID;

    this.setState({
      selectedCostPricePatternID: actualSelectedCostPricePatternID,
      tableData: null,
      hasTableDataRetrievingForCurrentFilteringNotStartedYet: true
    });

    // selectedBusinessUnitID
    /* 【 理論：React 】 ステートの更新が非同期なので、this.state.selectedBusinessUnitIDを直接渡すと、エラーが発生する。 */
    this.retrieveTableData({ selectedCostPricePatternID: actualSelectedCostPricePatternID }).
        catch((error: unknown): void => { console.error(error); });

  }

  private onExcelFileDownloadingButtonClicked(): void {

    if (this.state.tableData === null) {
      throw new Error(
        "論理エラー：期待に反し「costPriceRegistrationPage.onExcelFileDownloadingButtonClicked」が呼び出された時点" +
            "「state.tableData」は未初期化。"
      );
    }


    ExcelHelper.writeDataToFile({
      headerCellsContent: [
        "ID",
        this.getLocalizedString("table.headers.businessUnitCostPriceCode"),
        this.getLocalizedString("table.headers.businessUnitCostPriceLocalizedName"),
        this.getLocalizedString("table.headers.costPriceType"),
        this.getLocalizedString("table.headers.currency"),
        this.getLocalizedString("table.headers.costPricePatternLocalizedName"),
        this.getLocalizedString("table.headers.formattedModelCategoriesNames"),
        this.getLocalizedString("table.headers.formattedSalesDestinations"),
        this.getLocalizedString("table.headers.formattedSecondSalesDestinations"),
        this.getLocalizedString("table.headers.startYearAndMonth__YYYYMM"),
        this.getLocalizedString("table.headers.costPriceAmount"),
      ],
      bodyCellsContent: this.state.tableData.rows,
      transformItemToCellsArray: (rowData: CostPriceRegistrationPageBFF.TableData.Row): Array<string | number | boolean> =>
          {

            const cellsOfRow: Array<string | number | boolean> = [];

            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.costPriceRegisterID] =
                rowData.costPriceRegisterID;
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.businessUnitCostPriceCode] =
                rowData.businessUnitCostPriceCode;
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.businessUnitCostPriceLocalizedName] =
                rowData.businessUnitCostPriceLocalizedName;
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.costPriceType] =
                this.getLocalizedCostPriceType(rowData.costPriceType);
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.currencyCode] =
                rowData.currencyCode;
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.costPricePatternLocalizedName] =
                rowData.costPricePatternLocalizedName ?? "";
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.formattedModelCategoriesNames] =
                rowData.formattedModelCategoriesNames;
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.formattedSalesDestinations] =
                rowData.formattedSalesDestinations;
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.formattedResellingDestinations] =
                rowData.formattedResellingDestinations;
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.startYearAndMonth__YYYYMM] =
                rowData.startYearAndMonth__YYYYMM ?? "";
            cellsOfRow[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.costPriceAmount] =
                rowData.costPriceAmount ?? "";

            return cellsOfRow;

          },
      outputFileNameWithExtension: "cost_price_register_data.xlsx"
    });

  }

  private onExcelFileUploadingButtonClicked(): void {
    this.reactReferences.excelFilePicker.current?.click();
  }

  private async onExcelFilePicked(changingEvent: React.ChangeEvent<HTMLInputElement>): Promise<void> {

    const targetExcelFile: File | undefined = changingEvent.target.files?.[0];

    if (typeof targetExcelFile === "undefined") {

      this.resetExcelFilePicker();

      throw new Error(
        "論理エラー：期待に反し「costPriceRegistrationPage.onExcelFilePicked」が呼び出された時点" +
            "イベントオブジェクトにあるファイル配列が空になっている。"
      );

    }


    /* 【 方法論 】 正しい値が入っている`input`要素の`accept`アトリビュートが存在している限り、起きないので、コンソール通知だけで良い。 */
    if (
      !CostPriceRegistrationPage.supportedSpreadsheetsFileNameExtensionsWithLeadingDots.some(
        (supportedSpreadsheetFilenameExtensionWithLeadingDot: string): boolean =>
            targetExcelFile.name.endsWith(supportedSpreadsheetFilenameExtensionWithLeadingDot)
      )
    ) {
      console.error(`ファイル「${ targetExcelFile.name }」はサポートされていないファイル名拡張子を含めている。`);
      this.resetExcelFilePicker();
      return;
    }


    Backdrop.display({ accessibilityGuidance: "guidances.screenReaderOnly.excelFileExportingInProgress" });

    let rawUpdatedCostPriceRegistrationsRequestData: ReadonlyArray<CostPriceRegistrationPage.ExcelFile.RowRawData>;

    try {

      rawUpdatedCostPriceRegistrationsRequestData = await ExcelHelper.parseFile({
        targetFile: targetExcelFile,
        buildItem: (cellsContent: ReadonlyArray<unknown>): CostPriceRegistrationPage.ExcelFile.RowRawData => {

          const costPriceRegistrationRawValue: unknown =
            cellsContent[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.costPriceAmount];

          return ({
            costPriceRegistrationID: cellsContent[CostPriceRegistrationPage.ExcelFile.ColumnsIndexes.costPriceRegisterID],
            costPriceRegistrationValue:
                typeof costPriceRegistrationRawValue === "string" && costPriceRegistrationRawValue.length > 0 ?
                    costPriceRegistrationRawValue : 0
          });

        },
        mustSkipFirstRow: true
      });

    } catch (error: unknown) {

      console.error("エクセルファイル処理エラー:", error);

      Backdrop.dismiss();

      this.stickyMessageAtom.addErrorMessage({ text: this.getLocalizedString("errors.excelDataParsingFailed") });

      this.resetExcelFilePicker();

      return;

    }


    const rawUpdatedCostPriceRegistrationsRequestDataValidationResult:
        UpdatedCostPriceRegistrationsRequestDataValidator.ValidationResult =
            UpdatedCostPriceRegistrationsRequestDataValidator.validate(rawUpdatedCostPriceRegistrationsRequestData);

    if (rawUpdatedCostPriceRegistrationsRequestDataValidationResult.isInvalid) {

      this.setState({
        validationErrorsForDataFromExcel: rawUpdatedCostPriceRegistrationsRequestDataValidationResult.
            validationErrorsDataForEachItem.map(
              (
                {
                  itemIndex,
                  dataForEachError
                }: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorsDataForSpecificItem
              ): CostPriceRegistrationPage.ExcelFile.ValidationErrorsForSpecificLine =>
                  ({
                    lineNumber: itemIndex + 2,
                    localizedMessages: dataForEachError.map(
                      ({ code, ...parameters }: UpdatedCostPriceRegistrationsRequestDataValidator.ValidationErrorData): string =>
                          this.getLocalizedString(`errors.excelFileValidation.${ code }`, parameters)
                    )
                  })
            )
      });

      Backdrop.dismiss();
      this.resetExcelFilePicker();

      return;

    }


    /* 【 方法論 】 前回の試しから未削除のバリデーションエラーが残っている事がある。 */
    this.setState({ validationErrorsForDataFromExcel: [] });

    try {

      await this.BFF.updateCostPricesValues(rawUpdatedCostPriceRegistrationsRequestDataValidationResult.validatedData);

    } catch (error: unknown) {

      console.error("エクセルファイルからのデータ送信中エラーが発生:", error);

      this.stickyMessageAtom.addErrorMessage({
        text: this.getLocalizedString("errors.importedFromExcelDataSubmittingFailed")
      });

      return ;

    } finally {

      Backdrop.dismiss();

      this.resetExcelFilePicker();

    }


    this.stickyMessageAtom.addSuccessMessage({
      text: this.getLocalizedString("guidances.importedFromExcelDataSubmittingSucceeded")
    });

    if (this.state.selectedBusinessUnitID !== null && this.state.selectedCostPriceVersionID !== null) {
      this.retrieveTableData().
          catch((error: unknown): void => { console.error(error); });
    }

  }


  /* ━━━ Rendering ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public render(): React.ReactNode {
    return (
      <div className="max-w-7xl mx-auto px-10 py-14">

        <PageTopHeading>{ this.getLocalizedString("topHeading") }</PageTopHeading>

        { this.actionBar }

        { this.upperErrorsMessagesBoxes }

        <div className={ CSS_Classes["table-decorativeWrapper"] }>
          { this.tableView }
        </div>

        <StickyMessageAtomClassComponentAdapter
          adapterReference={ this.reactReferences.stickyMessageAtom }
        />

      </div>
    );
  }


  /* ┅┅┅ Action Bar ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private get actionBar(): React.ReactNode {
    return (
      <div className={ CSS_Classes.actionBar }>

        <BusinessUnitsDropDownList
          label={ this.getLocalizedString("controls.dropDownLists.businessUnits.label") }
          placeholder={
            this.getLocalizedString(
              "controls.dropDownLists.businessUnits.placeholders." +
                  (this.state.businessUnits.length > 0 ? "normal" : "noData")
            )
          }
          businessUnits={ this.state.businessUnits }
          selectedBusinessUnitID={ this.state.selectedBusinessUnitID }
          onBusinessUnitSelected={ this.onBusinessUnitItemSelected.bind(this) }
          loading={ this.state.isBusinessUnitsRetrievingInProgressOrNotStartedYet }
          disabled={ this.state.businessUnits.length === 0 }
          isVerticalOrientation={ true }
          className={ CSS_Classes["actionBar-dropDownList"] }
        />

        <DropDownList
          label={ this.getLocalizedString("controls.dropDownLists.costPriceVersions.label") }
          placeholder={
            this.getLocalizedString(
              "controls.dropDownLists.costPriceVersions.placeholders." +
                  (this.state.costPriceVersionsDropDownListItems.length > 0 ? "normal" : "noData")
            )
          }
          itemsData={
            this.state.costPriceVersionsDropDownListItems.map(
              (
                {
                  costPriceVersionID,
                  costPriceVersionName
                }: CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData.Item): DropDownList.ItemData =>
                    ({
                      key: costPriceVersionID,
                      value: costPriceVersionID,
                      displayingNode: costPriceVersionName
                    })
            )
          }
          value={ this.state.selectedCostPriceVersionID }
          onValueChange={ this.onCostPriceVersionSelected.bind(this) }
          isVerticalOrientation={ true }
          disabled={ this.state.costPriceVersionsDropDownListItems.length === 0 }
          loading={ this.state.isCostPriceVersionsDropDownListItemsRetrievingInProgress }
          className={ CSS_Classes["actionBar-dropDownList"] }
        />

        <DropDownList
          label={ this.getLocalizedString("controls.dropDownLists.constPricePatterns.label") }
          placeholder={
            this.getLocalizedString(
              "controls.dropDownLists.constPricePatterns.placeholders." +
                  (this.state.costPricePatternsDropDownListItems.length > 0 ? "normal" : "noData")
            )
          }
          itemsData={
            [
              {
                key: "__ALL__",
                value: "__ALL__",
                displayingNode: this.getLocalizedString("controls.dropDownLists.constPricePatterns.selectAll")
              },
              ...this.state.costPricePatternsDropDownListItems.map(
                (
                  {
                    costPricePatternID,
                    costPricePatternName
                  }: CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData.Item
                ): DropDownList.ItemData =>
                    ({
                      key: costPricePatternID,
                      value: costPricePatternID,
                      displayingNode: costPricePatternName
                    })
              )
            ]
          }
          value={ this.state.selectedCostPricePatternID === null ? "__ALL__" : this.state.selectedCostPricePatternID }
          onValueChange={ this.onCostPricePatternSelected.bind(this) }
          isVerticalOrientation={ true }
          disabled={ this.state.costPricePatternsDropDownListItems.length === 0 }
          loading={ this.state.isCostPricePatternsDropDownListItemsRetrievingInProgress }
          className={ CSS_Classes["actionBar-dropDownList"] }
        />

        <Button
          onClick={ this.onExcelFileDownloadingButtonClicked.bind(this) }
          disabled={ this.state.tableData === null || this.state.tableData.rows.length === 0 }
          className={ CSS_Classes["actionBar-button"] }
        >
          { this.getLocalizedString("controls.buttons.excelFileDownloading.label") }
        </Button>

        <Button
          onClick={ this.onExcelFileUploadingButtonClicked.bind(this) }
          className={ CSS_Classes["actionBar-button"] }
        >
          { this.getLocalizedString("controls.buttons.excelFileUploading.label") }
        </Button>

        <input
          ref={ this.reactReferences.excelFilePicker }
          type="file"
          accept={ CostPriceRegistrationPage.supportedSpreadsheetsFileNameExtensionsWithLeadingDots.join(",") }
          className="hidden"
          onChange={ this.onExcelFilePicked.bind(this) }
        />

      </div>
    );
  }


  /* ┅┅┅ Upper Errors Messages Boxes ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private get upperErrorsMessagesBoxes(): React.ReactNode {
    return [

      ...this.state.hasBusinessUnitsRetrievingErrorOccurred ?
        [
          <Alert
            severity={ Alert.Severities.error }
            className={ CSS_Classes.alert }
            actionButton={{
              label: this.getLocalizedString("controls.buttons.businessUnitsDataRetrievingRetrying.label"),
              onClickEventHandler: this.retrieveBusinessUnits.bind(this)
            }}
            key="ERROR_MESSAGE-BUSINESS_UNITS_DATA_RETRIEVING_FAILED"
          >
            { this.getLocalizedString("errors.businessUnitsDataRetrievingFailed") }
          </Alert>
        ] :
        [],

      ...this.state.hasCostPriceVersionsDropDownListItemsErrorOccurred ?
        [
          <Alert
            severity={ Alert.Severities.error }
            className={ CSS_Classes.alert }
            actionButton={{
              label: this.getLocalizedString("controls.buttons.costPriceVersionsDropDownListItemsRetrievingRetrying.label"),
              onClickEventHandler: this.retrieveCostPricePatternsDropDownListItems.bind(this)
            }}
            key="ERROR_MESSAGE-HAS_COST_PRICE_VERSIONS_DROP_DOWN_LIST_ITEMS_FAILED"
          >
            { this.getLocalizedString("errors.hasCostPriceVersionsDropDownListItemsFailed") }
          </Alert>
        ] :
        [],

      ...this.state.validationErrorsForDataFromExcel.length > 0 ?
        [
          <Alert
            severity={ Alert.Severities.error }
            className={ CSS_Classes.alert }
            onClickDismissingButton={ (): void => { this.setState({ validationErrorsForDataFromExcel: [] }) } }
            key="ERROR_MESSAGE-EXCEL_FILE_VALIDATION"
          >
            <span className={ `${ CSS_Classes["excelValidationErrorsMessage-title"] }` }>
              { this.getLocalizedString("errors.excelFileValidation.intro") }
            </span>
            <dl className={ CSS_Classes["excelValidationErrorsMessage-list"] }>
              {
                this.state.validationErrorsForDataFromExcel.map(
                  (
                    {
                      lineNumber,
                      localizedMessages
                    }: CostPriceRegistrationPage.ExcelFile.ValidationErrorsForSpecificLine
                  ): React.ReactNode =>
                      <React.Fragment key={ lineNumber }>
                        <dt>{ this.getLocalizedString("errors.excelFileValidation.lineNumberTitle", { lineNumber })}</dt>
                        <dd>
                          <ul>
                            {
                              localizedMessages.map(
                                (message: string): React.ReactNode =>
                                    <li key={ `${ lineNumber }-${ message }` }>{ message }</li>
                              )
                            }
                          </ul>
                        </dd>
                      </React.Fragment>
                )
              }
            </dl>
          </Alert>
        ] :
        []
    ];
  }


  /* ┅┅┅ Table View ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private get tableView(): React.ReactNode {
    if (this.state.hasTableDataRetrievingForCurrentFilteringNotStartedYet) {
      return this.tableWithDataRetrievingGuidance;
    } else if (this.state.businessUnits.length === 0) {
      return this.tableWithNoBusinessUnitsWarning;
    } else if (this.state.isCostPriceVersionsDropDownListItemsRetrievingInProgress) {
      return this.tableLoadingPlaceholder;
    } else if (this.state.costPriceVersionsDropDownListItems.length === 0) {
      return this.tableWithNoCostPriceVersionsWarning;
    } else if (this.state.isTableDataRetrievingInProgress) {
      return this.tableLoadingPlaceholder;
    } else if (this.state.hasTableDataRetrievingErrorOccurred) {
      return this.tableWithDataRetrievingError;
    } else if (this.state.tableData?.rows?.length === 0) {
      return this.tableWithNoDataMessage;
    } else {
      return this.tableWithData;
    }
  }

  private get tableWithDataRetrievingGuidance(): React.ReactNode {
    return (
      <>

        <Table>
          { this.tableHeader }
        </Table>

        <Alert
          severity={ Alert.Severities.info }
          className={ CSS_Classes.alert }
        >
          { this.getLocalizedString("guidances.tableDataDisplaying") }
        </Alert>

      </>
    );
  }

  private get tableWithNoBusinessUnitsWarning(): React.ReactNode {
    return (
      <>

        <Table>
          { this.tableHeader }
        </Table>

        <Alert
          severity={ Alert.Severities.warning }
          className={ CSS_Classes.alert }
        >
          { this.getLocalizedString("guidances.noBusinessUnits") }
        </Alert>

      </>
    );
  }

  private get tableLoadingPlaceholder(): React.ReactNode {
    return (
      <Table>

        <TableCaption className="sr-only">
          { this.getLocalizedString("guidances.screenReaderOnly.tableDataLoadingInProgress") }
        </TableCaption>

        { this.tableHeader }

        <TableBody className="bg-white">
          {
            (Array.from(new Array(10).keys())).map(
              (rowNumber: number): React.ReactNode => (
                <TableRow
                  key={ rowNumber }
                  className="border-b border-gray-200"
                >
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                  </TableCell>
                </TableRow>
              )
            )
          }
        </TableBody>

      </Table>
    );
  }

  private get tableWithNoCostPriceVersionsWarning(): React.ReactNode {
    return (
      <>

        <Table>
          { this.tableHeader }
        </Table>

        <Alert
          severity={ Alert.Severities.warning }
          className={ CSS_Classes.alert }
        >
          { this.getLocalizedString("guidances.noCostPriceVersions") }
        </Alert>

      </>
    );
  }

  private get tableWithDataRetrievingError(): React.ReactNode {
    return (
      <>

        <Table>
          { this.tableHeader }
        </Table>

        <Alert
          severity={ Alert.Severities.error }
          className={ CSS_Classes.alert }
          actionButton={{
            label: this.getLocalizedString("controls.buttons.tableDataRetrievingRetrying.label"),
            onClickEventHandler: this.retrieveTableData.bind(this),
          }}
        >
          { this.getLocalizedString("errors.tableDataRetrievingFailed") }
        </Alert>

      </>
    );
  }

  private get tableWithNoDataMessage(): React.ReactNode {
    return (
      <>

        <Table>
          { this.tableHeader }
        </Table>

        <Alert
          severity={ Alert.Severities.info }
          className={ CSS_Classes.alert }
        >
          { this.getLocalizedString("guidances.noDataToDisplay") }
        </Alert>

      </>
    );
  }

  private get tableWithData(): React.ReactNode {
    return (
      <>
        <Table>
          { this.tableHeader }
          <TableBody className="bg-white">
            {
              (this.state.tableData?.rows ?? []).map(
                (rowData: CostPriceRegistrationPageBFF.TableData.Row): React.ReactNode => (
                  <TableRow
                    key={ rowData.costPriceRegisterID }
                    className="border-b border-gray-200"
                  >
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.businessUnitCostPriceCode }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.businessUnitCostPriceLocalizedName }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { this.getLocalizedCostPriceType(rowData.costPriceType) }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.currencyCode }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.costPricePatternLocalizedName ?? "" }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.formattedModelCategoriesNames }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.formattedSalesDestinations }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.formattedResellingDestinations }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.startYearAndMonth__YYYYMM ?? "" }
                    </TableCell>
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.costPriceAmount ?? "" }
                    </TableCell>
                  </TableRow>
                )
              )
            }
          </TableBody>
        </Table>
      </>
    );
  }

  private getLocalizedCostPriceType(costPriceType: CostPriceRegistration.CostPriceTypes): string {
    return {
      [CostPriceRegistration.CostPriceTypes.amount]: this.getLocalizedString("table.bodyCells.costPriceType.amount"),
      [CostPriceRegistration.CostPriceTypes.rate]: this.getLocalizedString("table.bodyCells.costPriceType.rate")
    }[costPriceType];
  }

  private get tableHeader(): React.ReactNode {
    return (
      <TableHeader className="bg-[#00388E] text-white">
        <TableRow>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.businessUnitCostPriceCode") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.businessUnitCostPriceLocalizedName") }
          </TableHead>
          <TableHead className={ `${ CSS_Classes["table-headerCell"] } ${ CSS_Classes["table-headerCell__small"] }` }>
            { this.getLocalizedString("table.headers.costPriceType") }
          </TableHead>
          <TableHead className= { `${ CSS_Classes["table-headerCell"] } ${ CSS_Classes["table-headerCell__small"] }` }>
            { this.getLocalizedString("table.headers.currency") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.costPricePatternLocalizedName") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.formattedModelCategoriesNames") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.formattedSalesDestinations") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.formattedSecondSalesDestinations") }
          </TableHead>
          <TableHead className={ `${ CSS_Classes["table-headerCell"] } ${ CSS_Classes["table-headerCell__medium"] }` }>
            { this.getLocalizedString("table.headers.startYearAndMonth__YYYYMM") }
          </TableHead>
          <TableHead className={ `${ CSS_Classes["table-headerCell"] } ${ CSS_Classes["table-headerCell__large"] }` }>
            { this.getLocalizedString("table.headers.costPriceAmount") }
          </TableHead>
        </TableRow>
      </TableHeader>
    );
  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private getLocalizedString(pathWithoutNamespace: string, options?: I18n.TOptions): ReturnType<typeof I18n["t"]> {
    return this.props.t(pathWithoutNamespace, options);
  }

  private resetExcelFilePicker(): void {
    (this.reactReferences.excelFilePicker.current ?? { value: "" }).value = "";
  }

}


namespace CostPriceRegistrationPage {

  export type Props = Readonly<{

    /** @description 【 ライブラリ制限 】 「react-i18next」に注射されるため、Props上名前変更不可能。 */
    t: I18n.TFunction;

  }>;

  export type State = Readonly<{

    /* ┅┅┅ Filtering ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Business Unit Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    businessUnits: ReadonlyArray<BusinessUnit>;
    isBusinessUnitsRetrievingInProgressOrNotStartedYet: boolean;
    hasBusinessUnitsRetrievingErrorOccurred: boolean;
    selectedBusinessUnitID: string | null;

    /* ╍╍╍ Cost Price Versions ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    costPriceVersionsDropDownListItems: ReadonlyArray<CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData.Item>;
    isCostPriceVersionsDropDownListItemsRetrievingInProgress: boolean;
    hasCostPriceVersionsDropDownListItemsErrorOccurred: boolean;
    selectedCostPriceVersionID: string | null;

    /* ╍╍╍ Cost Register Patterns ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    costPricePatternsDropDownListItems: CostPriceRegistrationPageBFF.CostPricePatternsDropDownListItemsRetrieving.ResponseData;
    isCostPricePatternsDropDownListItemsRetrievingInProgress: boolean;
    hasCostPricePatternsDropDownListItemsRetrievingErrorOccurred: boolean;
    selectedCostPricePatternID: string | null;

    /* ┅┅┅ Table Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    tableData: CostPriceRegistrationPageBFF.TableData | null;
    hasTableDataRetrievingForCurrentFilteringNotStartedYet: boolean;
    isTableDataRetrievingInProgress: boolean;
    hasTableDataRetrievingErrorOccurred: boolean;

    /* ┅┅┅ Updating Data by Excel ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    validationErrorsForDataFromExcel: ReadonlyArray<CostPriceRegistrationPage.ExcelFile.ValidationErrorsForSpecificLine>;

  }>;


  export namespace ExcelFile {

    export type RowRawData = Readonly<{
      [ keys in keyof CostPriceRegistrationPageBFF.CostPriceRegistrationValuesUpdating.RequestData.Item ]: unknown;
    }>;

    export enum ColumnsIndexes {
      costPriceRegisterID = 0,
      businessUnitCostPriceCode = 1,
      businessUnitCostPriceLocalizedName = 2,
      costPriceType = 3,
      currencyCode = 4,
      costPricePatternLocalizedName = 5,
      formattedModelCategoriesNames = 6,
      formattedSalesDestinations = 7,
      formattedResellingDestinations = 8,
      startYearAndMonth__YYYYMM = 9,
      costPriceAmount = 10
    }

    export type ValidationErrorsForSpecificLine = Readonly<{
      lineNumber: number;
      localizedMessages: ReadonlyArray<string>;
    }>;

  }

}


export default withTranslation(CostPriceRegistrationPage.I18N_Namespace)(CostPriceRegistrationPage);
