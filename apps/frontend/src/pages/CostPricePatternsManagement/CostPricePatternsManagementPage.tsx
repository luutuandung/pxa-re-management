/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ Business Rules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ Entities ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  type BusinessUnit,
  CostPriceRegistration,

  /* ╍╍╍ Gateways ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  type BusinessUnitGateway,

  /* ╍╍╍ Restrictions ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  TagsOfSupportedLanguages,

  /* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricePatternsManagementPageBFF,
  CostPricesVersionsDropDownListBFF

} from "@pxa-re-management/shared";

/* ┅┅┅ Assets ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CSS_Classes from "./CostPricePatternsManagementPage.module.sass";

/* ┅┅┅ Event Bus ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { StickyMessageAtomClassComponentAdapter } from "@/store/stickyMessage.ts";

/* ┅┅┅ GUI Components ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import PageTopHeading from "@/components/atoms/PageTopHeading/PageTopHeading.tsx";
import DropDownList from "@/components/molecules/DropDownList/DropDownList.tsx";
import BusinessUnitsDropDownList from "@/components/molecules/DropDownList/Specials/BusinessUnits/BusinessUnitsDropDownList.tsx";
import Alert from "@/components/molecules/Alert.tsx";
import Button from "@/components/atoms/Button"
import TextBox from "@/components/molecules/TextBox/TextBox.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Table, TableCaption, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CostPricePatternsManagementDialog from
    "./components/CostPricesPatternsTypesManagementDialog/CostPricesPatternsTypesManagementDialog.tsx";
import Backdrop from "@/components/molecules/Backdrop.tsx";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as React from "react";
import * as I18n from "i18next";
import { withTranslation } from "react-i18next";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ClientDependenciesInjector from "@/dependencies-injection/ClientDependenciesInjector.ts";
import { getTagOfCurrentLanguage } from "@/i18n";


class CostPricePatternsManagementPage extends React.Component<
  CostPricePatternsManagementPage.Props,
  CostPricePatternsManagementPage.State
> {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static readonly I18N_Namespace: string = "costPricePatternsManagementPage";


  /* ━━━ Non-reactive Instance Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Dependencies ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly businessUnitGateway: BusinessUnitGateway = ClientDependenciesInjector.gateways.businessUnit;

  private readonly BFF: CostPricePatternsManagementPageBFF = ClientDependenciesInjector.BFF.pages.costPricePatternsManagement;
  private readonly costPricesVersionsDropDownListBFF: CostPricesVersionsDropDownListBFF = ClientDependenciesInjector.BFF.
      components.costPricesVersionsDropDownList;

  /* ┅┅┅ React References ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly reactReferences: Readonly<{
    stickyMessageAtom: React.RefObject<StickyMessageAtomClassComponentAdapter.API | null>;
  }> = {
    stickyMessageAtom: React.createRef()
  };


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public state: CostPricePatternsManagementPage.State = {

    /* ┅┅┅ Table Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Required Filtering ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    /* ─── Business Unit Items ────────────────────────────────────────────────────────────────────────────────────── */
    businessUnits: [],
    isBusinessUnitsRetrievingInProgressOrNotStartedYet: true,
    hasBusinessUnitsRetrievingErrorOccurred: false,
    selectedBusinessUnitID: null,

    /* ─── Cost Price Versions ────────────────────────────────────────────────────────────────────────────────────── */
    costPricesVersionsDropDownListItems: [],
    isCostsPriceVersionsDropDownListItemsRetrievingInProgress: false,
    hasCostPricesVersionsDropDownListItemsRetrievingErrorOccurred: false,
    selectedCostPriceVersionID: null,

    /* ╍╍╍ Rows ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    tableData: [],
    hasTableDataRetrievingForCurrentFilteringNotStartedYet: true,
    isTableDataRetrievingInProgress: false,
    hasTableDataRetrievingErrorOccurred: false,
    selectedTableRowsData: new Map(),
    tableSearchQuery: "",

    /* ┅┅┅ Other Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Cost Prices Patterns Types List Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    costPricesPatternsTypesListItems: [],
    isCostPricesPatternsTypesListItemsRetrievingInProgress: false,
    hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred: false,
    selectedCostPricePatternTypeID: null,

    /* ┅┅┅ Cost Price Pattern Registration Dialog ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    isCostPricePatternsManagementDialogOpened: false

  };


  /* ━━━ Event Bus ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private get stickyMessageAtom(): StickyMessageAtomClassComponentAdapter.API {
    return this.reactReferences.stickyMessageAtom.current ??
        ((): never => { throw new Error("期待に反し、「StickyMessageAtomClassComponentAdapter」が未初期化。"); })();
  }


  /* ━━━ Lifecycle Hooks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public override componentDidMount(): void {
    this.retrieveBusinessUnits().catch((error: unknown): void => { console.error(error); });
  }


  /* ━━━ Data Retrieving ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 【整備性】 この群のメソッドの順番を呼び出される順番通り保つ事。 */

  /** @description ドロップダウン専用事業部を取得。事業部及び原価バージョンを選ばないと、データ表示・管理不可能。 */
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

  /**
   * @description
   * ドロップダウン専用原価バージョンを取得。事業部及び原価バージョンを選ばないと、データ表示・管理不可能。<br/>
   * 【パフォーマンス最適化】 可能な時、事業部IDを直接渡すべき。（不可能な時もあるので、引数を任意化。）
   * */
  private async retrieveCostPriceVersionsDropDownListItems(
    selectedBusinessUnitID: string | null = this.state.selectedBusinessUnitID
  ): Promise<void> {

    if (selectedBusinessUnitID === null) {
      throw new Error(
        "論理エラー：意図に反し「costPricePatternsManagementPage.retrieveCostPriceVersionsDropDownListItems」が呼び出された時点" +
          "「state.selectedBusinessUnitID」は未初期化。"
      );
    }


    let costPriceVersionsDropDownListItems: ReadonlyArray<CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData.Item>;

    this.setState({
      isCostsPriceVersionsDropDownListItemsRetrievingInProgress: true,
      hasCostPricesVersionsDropDownListItemsRetrievingErrorOccurred: false
    });

    try {

      costPriceVersionsDropDownListItems = await this.costPricesVersionsDropDownListBFF.
          retrieveItems({ businessUnitID: selectedBusinessUnitID });

    } catch (error: unknown) {

      this.setState({
        hasCostPricesVersionsDropDownListItemsRetrievingErrorOccurred: true,
        isCostsPriceVersionsDropDownListItemsRetrievingInProgress: false
      });

      console.error(error);

      return;

    }


    this.setState({
      costPricesVersionsDropDownListItems: costPriceVersionsDropDownListItems,
      isCostsPriceVersionsDropDownListItemsRetrievingInProgress: false,
      hasBusinessUnitsRetrievingErrorOccurred: false
    });

  }

  /**
   * @description
   * 表専用データを取得。<br/>
   * 【 パフォーマンス最適化 】 可能な時、原価バージョンIDを直接渡すべき。（不可能な時もあるので、引数を任意化。） */
  private async retrieveTableData(
    selectedCostPriceVersionID: string | null = this.state.selectedCostPriceVersionID
  ): Promise<void> {

    if (this.state.selectedBusinessUnitID === null || selectedCostPriceVersionID === null) {
      throw new Error(
        "論理エラー：意図に反し「costPricePatternsManagementPage.retrieveTableData」が呼び出された時点、" +
            "「state.selectedBusinessUnitID」か、「state.selectedCostPriceVersionID」か、その両方が未初期化。"
      );
    }


    let tableData: CostPricePatternsManagementPageBFF.TableData;

    this.setState({
      tableData: [],
      hasTableDataRetrievingForCurrentFilteringNotStartedYet: false,
      isTableDataRetrievingInProgress: true,
      hasTableDataRetrievingErrorOccurred: false
    });

    try {

      tableData = await this.BFF.retrieveTableData({
        businessUnitID: this.state.selectedBusinessUnitID,
        costPriceVersionID: selectedCostPriceVersionID,
        languageTag: getTagOfCurrentLanguage()
      });

    } catch (error: unknown) {

      this.setState({
        hasTableDataRetrievingErrorOccurred: true,
        isTableDataRetrievingInProgress: false
      });

      console.error(error);

      return ;

    }


    this.setState({
      tableData,
      isTableDataRetrievingInProgress: false,
      hasTableDataRetrievingErrorOccurred: false
    });

  }

  /** @description ドロップダウン及びモーダルダイヤログに必要な原価パターン種類データを取得。 */
  private async retrieveCostPricesPatternsTypesListItems(): Promise<void> {

    if (this.state.selectedBusinessUnitID === null) {
      throw new Error(
        "論理エラー：意図に反し「costPricePatternsManagementPage.retrieveCostPricesPatternsTypesListItems」が呼び出された時点、" +
            "「state.selectedBusinessUnitID」が未初期化。"
      );
    }


    let costPricesPatternsTypesListItems: ReadonlyArray<
      CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item
    >;

    this.setState({
      isCostPricesPatternsTypesListItemsRetrievingInProgress: true,
      hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred: false
    });

    try {

      costPricesPatternsTypesListItems = await this.BFF.retrieveCostPricesPatternsTypesListItems({
        businessUnitID: this.state.selectedBusinessUnitID
      });

    } catch (error: unknown) {

      this.setState({
        hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred: true,
        isCostPricesPatternsTypesListItemsRetrievingInProgress: false
      });

      console.error(error);

      return;

    }


    this.setState({
      costPricesPatternsTypesListItems,
      isCostPricesPatternsTypesListItemsRetrievingInProgress: false,
      hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred: false
    });

  }


  /* ━━━ Actions Handling ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 【整備性】 この群のメソッドの順番を画面に該当しているコントロールが配置してある順番（上から下へ、左から右へ）に合わせる事。 */

  /* ┅┅┅ Drop Down Lists ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private async onBusinessUnitItemSelected(selectedBusinessUnitID: string): Promise<void> {

    this.setState({
      selectedBusinessUnitID,
      costPricesVersionsDropDownListItems: [],
      selectedCostPriceVersionID: null,
      tableData: [],
      hasTableDataRetrievingForCurrentFilteringNotStartedYet: true,
      costPricesPatternsTypesListItems: [],
      selectedCostPricePatternTypeID: null
    });

    return this.retrieveCostPriceVersionsDropDownListItems(selectedBusinessUnitID)

  }

  private onCostPriceVersionSelected(selectedCostPriceVersionID: string): void {

    this.setState({
      selectedCostPriceVersionID,
      tableData: [],
      hasTableDataRetrievingForCurrentFilteringNotStartedYet: true,
      costPricesPatternsTypesListItems: [],
      selectedCostPricePatternTypeID: null
    });

    Promise.all([
      this.retrieveTableData(selectedCostPriceVersionID),
      this.retrieveCostPricesPatternsTypesListItems()
    ]).
        catch((error: unknown): void => { console.error(error); });

  }

  private onCostPricePatternTypeSelected(selectedCostPricePatternTypeID: string): void {
    this.setState({ selectedCostPricePatternTypeID });
  }


  /* ┅┅┅ Data Saving ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private async onDataSavingButtonClicked(): Promise<void> {

    if (
      this.state.selectedBusinessUnitID === null ||
          this.state.selectedCostPriceVersionID === null ||
          this.state.selectedCostPricePatternTypeID === null
    ) {
      throw new Error(
        "論理エラー：意図に反し「costPricePatternsManagementPage.registerCostPricesForAllPairwiseCategoriesCombinations」が" +
            "呼び出された時点、「state.selectedBusinessUnitID」か、「state.selectedCostPriceVersionID」か、" +
            "「state.selectedCostPricePatternTypeID」か、その全部が未初期化。"
      );
    }


    Backdrop.display({
      accessibilityGuidance: this.getLocalizedString("guidances.screenReaderOnly.costPricesPatternSetupInProgress")
    });

    try {

      await this.BFF.registerCostPricesForAllPairwiseCategoriesCombinations({
        businessUnitID: this.state.selectedBusinessUnitID,
        costPriceVersionID: this.state.selectedCostPriceVersionID,
        costPricePatternID: this.state.selectedCostPricePatternTypeID,
        businessUnitsCostItems: Array.from(this.state.selectedTableRowsData.values()).map(
          (
            businessUnitCostItemData: CostPricePatternsManagementPage.State.SelectedTableRowsData.BusinessUnitCostItem
          ): CostPricePatternsManagementPageBFF.RegisteringOfCostPricesForAllPairwiseCategoriesCombinations.
              RequestData.BusinessUnitCostItem =>
                  ({
                    ID: businessUnitCostItemData.ID,
                    costPriceType: businessUnitCostItemData.costPriceType
                  })
        )
      });

    } catch (error: unknown) {

      this.stickyMessageAtom.addErrorMessage({
        text: this.getLocalizedString("errors.costPricesPatternSetupFailed")
      });

       console.error(error);

      return;

    } finally {

      Backdrop.dismiss();

    }


    this.stickyMessageAtom.addSuccessMessage({
      text: this.getLocalizedString("guidances.costPricesPatternSetupSucceeded")
    });

  }


  /* ┅┅┅ Table Viewing ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private onToggleTableRowSelecting(
    rowKey: string,
    {
      businessUnitCostItemID,
      costPriceType
    }: Pick<
      CostPricePatternsManagementPageBFF.TableData.Row,
        "businessUnitCostItemID" |
        "costPriceType"
    >
  ): void {

    const updatedSelectedTableRowsData: Map<
      CostPricePatternsManagementPage.State.SelectedTableRowsData.CompoundKey,
      CostPricePatternsManagementPage.State.SelectedTableRowsData.BusinessUnitCostItem
    > = new Map(this.state.selectedTableRowsData.entries());

    if (!updatedSelectedTableRowsData.delete(rowKey)) {
      updatedSelectedTableRowsData.set(
        rowKey,
        {
          ID: businessUnitCostItemID,
          costPriceType
        }
      );
    }

    this.setState({ selectedTableRowsData: updatedSelectedTableRowsData });

  }


  /* ━━━ Rendering ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public render(): React.ReactNode {
    return (
      <div className="max-w-7xl mx-auto px-10 py-14">

        <PageTopHeading>{ this.getLocalizedString("topHeading") }</PageTopHeading>

        { this.actionBar }

        { this.upperErrorMessageBox }

        { this.tableSearchBox }

        <div className={ CSS_Classes["table-decorativeWrapper"] }>
          { this.tableView }
        </div>

        { this.costPricePatternsManagementDialog }

        <StickyMessageAtomClassComponentAdapter adapterReference={ this.reactReferences.stickyMessageAtom } />

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
          isVerticalOrientation={ false }
          className={ CSS_Classes["actionBar-dropDownList"] }
        />

         <DropDownList
          label={ this.getLocalizedString("controls.dropDownLists.costPriceVersions.label") }
          placeholder={
            this.getLocalizedString(
              "controls.dropDownLists.costPriceVersions.placeholders." +
                  (this.state.costPricesVersionsDropDownListItems.length > 0 ? "normal" : "noData")
            )
         }
          itemsData={
            this.state.costPricesVersionsDropDownListItems.map(
              (
                {
                  costPriceVersionID,
                  costPriceVersionName
                }: CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData.Item
              ): DropDownList.ItemData =>
                  ({
                    key: costPriceVersionID,
                    value: costPriceVersionID,
                    displayingNode: costPriceVersionName
                  })
            )
          }
          value={ this.state.selectedCostPriceVersionID }
          onValueChange={ this.onCostPriceVersionSelected.bind(this) }
          isVerticalOrientation={ false }
          disabled={ this.state.costPricesVersionsDropDownListItems.length === 0 }
          loading={ this.state.isCostsPriceVersionsDropDownListItemsRetrievingInProgress }
          className={ CSS_Classes["actionBar-dropDownList"] }
        />

        <Button
          onClick={ (): void => { this.setState({ isCostPricePatternsManagementDialogOpened: true }); } }
          disabled={ this.state.selectedBusinessUnitID === null || this.state.selectedCostPriceVersionID === null }
          className={ CSS_Classes["actionBar-button"] }
        >
          { this.getLocalizedString("controls.buttons.costPricesPatternsTypesManagementDialogOpening.label") }
        </Button>

        <DropDownList
          label={ this.getLocalizedString("controls.dropDownLists.costPricesPatternsTypes.label") }
          placeholder={
            this.getLocalizedString(
              "controls.dropDownLists.costPricesPatternsTypes.placeholders." +
                  (this.state.costPricesPatternsTypesListItems.length > 0 ? "normal" : "noData")
            )
          }
          itemsData={
            this.state.costPricesPatternsTypesListItems.map(
              (
                {
                  costPricePatternID,
                  costPricePatternNames
                }: CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item
              ): DropDownList.ItemData =>
                  ({
                    key: costPricePatternID,
                    value: costPricePatternID,
                    displayingNode: {
                      [TagsOfSupportedLanguages.japanese]: costPricePatternNames.japanese,
                      [TagsOfSupportedLanguages.english]: costPricePatternNames.english,
                      [TagsOfSupportedLanguages.chinese]: costPricePatternNames.chinese,
                    }[getTagOfCurrentLanguage()]
                  })
            )
          }
          value={ this.state.selectedCostPricePatternTypeID }
          onValueChange={ this.onCostPricePatternTypeSelected.bind(this) }
          isVerticalOrientation={ false }
          disabled={ this.state.costPricesPatternsTypesListItems.length === 0 }
          loading={ this.state.isCostPricesPatternsTypesListItemsRetrievingInProgress }
          className={ CSS_Classes["actionBar-dropDownList"] }
        />

        <Button
          onClick={ this.onDataSavingButtonClicked.bind(this) }
          disabled={
            this.state.selectedBusinessUnitID === null ||
                this.state.selectedCostPriceVersionID === null ||
                this.state.selectedCostPricePatternTypeID === null ||
                this.state.selectedTableRowsData.size === 0
          }
          className={ CSS_Classes["actionBar-button"] }
        >
          { this.getLocalizedString("controls.buttons.dataSaving.label") }
        </Button>

      </div>
    );
  }


  /* ┅┅┅ Upper Error Message Box ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private get upperErrorMessageBox(): React.ReactNode {

    if (this.state.hasBusinessUnitsRetrievingErrorOccurred) {
      return (
        <Alert
          severity={ Alert.Severities.error }
          className={ CSS_Classes.alert }
          actionButton={{
            label: this.getLocalizedString("controls.buttons.retryingOfBusinessUnitsDataRetrieving.label"),
            onClickEventHandler: this.retrieveBusinessUnits.bind(this)
          }}
        >
          { this.getLocalizedString("errors.businessUnitsDataRetrievingFailed") }
        </Alert>
      );
    }


    if (this.state.hasCostPricesVersionsDropDownListItemsRetrievingErrorOccurred) {
      return (
        <Alert
          severity={ Alert.Severities.error }
          className={ CSS_Classes.alert }
          actionButton={{
            label: this.getLocalizedString("controls.buttons.retryingOfCostPricesVersionsDropDownListItemsRetrieving.label"),
            onClickEventHandler: this.retrieveCostPriceVersionsDropDownListItems.bind(this)
          }}
        >
          { this.getLocalizedString("errors.costPriceVersionsDropDownListItemsRetrievingFailed") }
        </Alert>
      );
    }


    if (this.state.hasCostPricesVersionsDropDownListItemsRetrievingErrorOccurred) {
      return (
        <Alert
          severity={ Alert.Severities.error }
          className={ CSS_Classes.alert }
          actionButton={{
            label: this.getLocalizedString("controls.buttons.costPricesPatternsTypesListItemsRetrieving.label"),
            onClickEventHandler: this.retrieveCostPricesPatternsTypesListItems.bind(this)
          }}
        >
          { this.getLocalizedString("errors.costPriceVersionsDropDownListItemsRetrievingFailed") }
        </Alert>
      );
    }


    return null;

  }

  private get tableSearchBox(): React.ReactNode {
    
    if (
      this.state.hasTableDataRetrievingForCurrentFilteringNotStartedYet ||
      this.state.isTableDataRetrievingInProgress ||
      this.state.hasTableDataRetrievingErrorOccurred ||
      this.state.tableData.length === 0
    ) {
      return null;
    }

    return (
      <div className="mt-6 mb-6 max-w-2xs">
        <TextBox
          value={ this.state.tableSearchQuery }
          onChangeEventHandler={ (value: string): void => {
            this.setState({ tableSearchQuery: value });
          }}
          nativeInputElementAttributes={{
            placeholder: this.getLocalizedString("controls.tableSearchBox.placeholder")
          }}
        />
      </div>
    );
  }

  /* ┅┅┅ Table View ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private get tableView(): React.ReactNode {
    if (this.state.hasTableDataRetrievingForCurrentFilteringNotStartedYet) {
      return this.tableWithDataRetrievingGuidance;
    } else if (this.state.businessUnits.length === 0) {
      return this.tableWithNoBusinessUnitsWarning;
    } else if (this.state.isTableDataRetrievingInProgress) {
      return this.tableLoadingPlaceholder;
    } else if (this.state.hasTableDataRetrievingErrorOccurred) {
      return this.tableWithDataRetrievingError;
    } else if (this.state.tableData.length === 0) {
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
                </TableRow>
              )
            )
          }
        </TableBody>

      </Table>
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
            label: this.getLocalizedString("controls.buttons.retryingOfTableDataRetrieving.label"),
            onClickEventHandler: (): void => {
              this.retrieveTableData().catch((error: unknown): void => { console.error(error); })
            }
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

  private get tableHeader(): React.ReactNode {
    return (
      <TableHeader className="bg-[#00388E] text-white">
        <TableRow>
          <TableHead className={ `${ CSS_Classes["table-headerCell"] } ${ CSS_Classes["table-headerCell__small"] }` }>
            <span
              className="sr-only"
              id="COST_PRICE_PATTERNS_MANAGEMENT_PAGE-TABLE_HEADER-SELECTING"
            >
              { this.getLocalizedString("table.headers.selecting") }
            </span>
            <Checkbox
              checked={ false }
              disabled={
                this.state.hasTableDataRetrievingForCurrentFilteringNotStartedYet ||
                    this.state.isTableDataRetrievingInProgress ||
                    this.state.hasTableDataRetrievingErrorOccurred ||
                    this.state.tableData.length === 0
              }
              aria-labelledby="COST_PRICE_PATTERNS_MANAGEMENT_PAGE-TABLE_HEADER-SELECTING"
            />
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.businessUnitCode") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.businessUnitName") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.costPriceType") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.currencyCode") }
          </TableHead>
           <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.costPricePatternLocalizedName") }
          </TableHead>
        </TableRow>
      </TableHeader>
    );
  }

  private get tableWithData(): React.ReactNode {
    
    /* 【 検索機能 】 検索クエリに基づいてテーブルデータをフィルタリング */
    const filteredTableData = this.state.tableSearchQuery.trim() === "" ?
      this.state.tableData :
      this.state.tableData.filter(
        (rowData: CostPricePatternsManagementPageBFF.TableData.Row): boolean => {
          const searchQuery = this.state.tableSearchQuery.toLowerCase();
          return (
            rowData.businessUnitCode.toLowerCase().includes(searchQuery) ||
            rowData.businessUnitLocalizedName.toLowerCase().includes(searchQuery)
          );
        }
      );

    return (
      <Table>
        { this.tableHeader }
        <TableBody className="bg-white">
          {
            filteredTableData.length > 0 ? (
              filteredTableData.map(
                (rowData: CostPricePatternsManagementPageBFF.TableData.Row): React.ReactNode => {

                  const reusableKey: string = CostPricePatternsManagementPage.State.SelectedTableRowsData.CompoundKey.
                      generate(rowData);

                  return (
                    <TableRow
                      key={ reusableKey }
                      className="border-b border-gray-200"
                    >
                      <TableCell className={CSS_Classes["table-bodyCell"]}>
                        <Checkbox
                          checked={ this.state.selectedTableRowsData.has(reusableKey) }
                          onCheckedChange={ (): void => { this.onToggleTableRowSelecting(reusableKey, rowData); } }
                        />
                      </TableCell>
                      <TableCell className={ CSS_Classes["table-bodyCell"] }>
                        { rowData.businessUnitCode }
                      </TableCell>
                      <TableCell className={ CSS_Classes["table-bodyCell"] }>
                        { rowData.businessUnitLocalizedName }
                      </TableCell>
                      <TableCell className={ CSS_Classes["table-bodyCell"] }>
                        {
                          {
                            [CostPriceRegistration.CostPriceTypes.amount]: this.getLocalizedString("table.bodyCells.costPriceType.amount"),
                            [CostPriceRegistration.CostPriceTypes.rate]: this.getLocalizedString("table.bodyCells.costPriceType.rate")
                          }[rowData.costPriceType]
                        }
                      </TableCell>
                      <TableCell className={ CSS_Classes["table-bodyCell"] }>
                        { rowData.currencyCode }
                      </TableCell>
                      <TableCell className={ CSS_Classes["table-bodyCell"] }>
                        { rowData.costPricePatternLocalizedName }
                      </TableCell>
                    </TableRow>
                  );

                }
              )
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  { this.getLocalizedString("table.noSearchResults") }
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    );

  }


  /* ┅┅┅ Cost Price Patterns Management Dialog ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private get costPricePatternsManagementDialog(): React.ReactNode {
    return (
      this.state.selectedBusinessUnitID !== null &&
      this.state.selectedCostPriceVersionID !== null &&
      this.state.isCostPricePatternsManagementDialogOpened
    ) ?
        (
          <CostPricePatternsManagementDialog
            targetBusinessUnitID={ this.state.selectedBusinessUnitID }
            costPricesPatternsTypesListItems={ this.state.costPricesPatternsTypesListItems }
            isCostPricesPatternsTypesListItemsRetrievingInProgress={
              this.state.isCostPricesPatternsTypesListItemsRetrievingInProgress
            }
            hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred={
              this.state.hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred
            }
            onCostPricesPatternsTypesListRefreshingRequestedEventHandler={
              this.retrieveCostPricesPatternsTypesListItems.bind(this)
            }
            onManagedToCloseEventHandler={
              (): void => { this.setState({ isCostPricePatternsManagementDialogOpened: false }) }
            }
          />
        ) :
        null;
  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private getLocalizedString(pathWithoutNamespace: string, options?: I18n.TOptions): ReturnType<typeof I18n["t"]> {
    return this.props.t(pathWithoutNamespace, options);
  }

}


namespace CostPricePatternsManagementPage {

  /* ━━━ Props ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Props = Readonly<{

    /** @description 【 ライブラリ制限 】 「react-i18next」に注射されるため、Props上名前変更不可能。 */
    t: I18n.TFunction;

  }>;


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type State = Readonly<{

    /* ┅┅┅ Table Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Required Filtering ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    /* ─── Business Unit Items ────────────────────────────────────────────────────────────────────────────────────── */
    businessUnits: ReadonlyArray<BusinessUnit>;
    isBusinessUnitsRetrievingInProgressOrNotStartedYet: boolean;
    hasBusinessUnitsRetrievingErrorOccurred: boolean;
    selectedBusinessUnitID: string | null;

    /* ─── Cost Prices Versions ───────────────────────────────────────────────────────────────────────────────────── */
    costPricesVersionsDropDownListItems: ReadonlyArray<CostPricesVersionsDropDownListBFF.ItemsRetrieving.ResponseData.Item>;
    isCostsPriceVersionsDropDownListItemsRetrievingInProgress: boolean;
    hasCostPricesVersionsDropDownListItemsRetrievingErrorOccurred: boolean;
    selectedCostPriceVersionID: string | null;

    /* ╍╍╍ Rows ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    tableData: ReadonlyArray<CostPricePatternsManagementPageBFF.TableData.Row>;
    hasTableDataRetrievingForCurrentFilteringNotStartedYet: boolean;
    isTableDataRetrievingInProgress: boolean;
    hasTableDataRetrievingErrorOccurred: boolean;
    selectedTableRowsData: CostPricePatternsManagementPage.State.SelectedTableRowsData;
    tableSearchQuery: string;

    /* ┅┅┅ Other Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Cost Prices Patterns Types List Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    costPricesPatternsTypesListItems: ReadonlyArray<
      CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item
    >;
    isCostPricesPatternsTypesListItemsRetrievingInProgress: boolean;
    hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred: boolean;
    selectedCostPricePatternTypeID: string | null;

    /* ┅┅┅ Cost Price Pattern Registration Dialog ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    isCostPricePatternsManagementDialogOpened: boolean;

  }>;

  export namespace State {

    export type SelectedTableRowsData = ReadonlyMap<
      SelectedTableRowsData.CompoundKey,
      SelectedTableRowsData.BusinessUnitCostItem
    >;

    export namespace SelectedTableRowsData {

      export type CompoundKey = string;

      export namespace CompoundKey {
        export function generate(
          {
            businessUnitCostItemID,
            costPriceType,
            currencyCode
          }: Pick<
            CostPricePatternsManagementPageBFF.TableData.Row,
              "businessUnitCostItemID" |
              "costPriceType" |
              "currencyCode"
          >
        ): string {
          return `${ businessUnitCostItemID }-${ costPriceType }-${ currencyCode }`;
        }
      }

      export type BusinessUnitCostItem = Readonly<{
        ID: string;
        costPriceType: CostPriceRegistration.CostPriceTypes;
      }>;

    }

  }

}


export default withTranslation(CostPricePatternsManagementPage.I18N_Namespace)(CostPricePatternsManagementPage);
