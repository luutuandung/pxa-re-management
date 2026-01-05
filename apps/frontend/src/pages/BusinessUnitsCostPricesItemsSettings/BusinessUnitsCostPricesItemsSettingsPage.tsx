/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
import {

  /* ┅┅┅ Business Rules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ Entities ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  type BusinessUnit,
  BusinessUnitCostPriceItem,

  /* ╍╍╍ Gateways ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  type BusinessUnitGateway,
  type BusinessUnitCostPriceItemGateway,
  type CurrencyGateway,

  /* ╍╍╍ BFF ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  type BusinessUnitsCostPricesItemsSettingsPageBFF,

  /* ┅┅┅ Validations ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  BusinessUnitsCostPricesItemsDataValidator

} from "@pxa-re-management/shared";

/* ┅┅┅ Assets ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CSS_Classes from "./BusinessUnitsCostPricesItemsSettingsPage.module.sass";

/* ┅┅┅ Event Bus ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { StickyMessageAtomClassComponentAdapter } from "@/store/stickyMessage.ts";

/* ┅┅┅ GUI Components ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import Alert from "@/components/molecules/Alert.tsx";
import PageTopHeading from "@/components/atoms/PageTopHeading/PageTopHeading.tsx";
import BusinessUnitsDropDownList from
    "@/components/molecules/DropDownList/Specials/BusinessUnits/BusinessUnitsDropDownList.tsx";
import TextBox from "@/components/molecules/TextBox/TextBox.tsx";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table.tsx";
import Button from "@/components/atoms/Button"
import Backdrop from "@/components/molecules/Backdrop.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import DropDownList from "@/components/molecules/DropDownList/DropDownList.tsx";
import Pagination from "@/components/molecules/Pagination/Pagination.tsx";
import ConfirmationDialog from "@/components/organisms/ConfirmationDialog.tsx";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import React from "react";
import * as I18n from "i18next";
import { withTranslation } from "react-i18next";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ClientDependenciesInjector from "@/dependencies-injection/ClientDependenciesInjector.ts";
import ExcelHelper from "@/utils/ExcelHelper.ts";
import { getTagOfCurrentLanguage } from "@/i18n";


class BusinessUnitsCostPricesItemsSettingsPage extends React.Component<
  BusinessUnitsCostPricesItemsSettingsPage.Props,
  BusinessUnitsCostPricesItemsSettingsPage.State
> {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static readonly I18N_Namespace: string = "businessCostPricesItemsSettingsSetupPage";

  private static readonly supportedSpreadsheetsFileNameExtensionsWithLeadingDots: ReadonlyArray<string> = [ ".xlsx" ];

  private static readonly TEMPORARY_BUSINESS_UNIT_COST_PRICE_ITEM_ID_PREFIX: string = "TEMPORARY__";
  private static readonly DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE: string = "--EMPTY--";


  /* ━━━ Non-reactive Instance Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private readonly currentYear: number = new Date().getFullYear();


  /* ┅┅┅ Dependencies ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly businessUnitGateway: BusinessUnitGateway = ClientDependenciesInjector.gateways.businessUnit;
  private readonly businessUnitCostPriceItemGateway: BusinessUnitCostPriceItemGateway =
      ClientDependenciesInjector.gateways.businessUnitCostPriceItem;
  private readonly currencyGateway: CurrencyGateway = ClientDependenciesInjector.gateways.currency;

  private readonly BFF: BusinessUnitsCostPricesItemsSettingsPageBFF =
      ClientDependenciesInjector.BFF.pages.businessUnitsCostPricesItemsSettings;


  /* ┅┅┅ React References ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly reactReferences: Readonly<{
    excelFilePicker: React.RefObject<HTMLInputElement | null>;
    stickyMessageAtom: React.RefObject<StickyMessageAtomClassComponentAdapter.API | null>;
  }> = {
    excelFilePicker: React.createRef(),
    stickyMessageAtom: React.createRef()
  };


  /* ┅┅┅ Drop Down Lists ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly yearOfActualityStartingDropDownListItemsData: ReadonlyArray<DropDownList.ItemData>;
  private readonly yearOfActualityEndingDropDownListItemsData: ReadonlyArray<DropDownList.ItemData>;

  private readonly monthDropDownListsData: ReadonlyArray<DropDownList.ItemData> = Array.from(new Array(12).keys()).map(
    (monthNumber__numerationFrom0: number): DropDownList.ItemData => {

      const monthNumber__numerationFrom1: number = monthNumber__numerationFrom0 + 1;

      return ({
        key: monthNumber__numerationFrom1,
        value: String(monthNumber__numerationFrom1),
        displayingNode: monthNumber__numerationFrom1
      });

    }

  );


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public state: BusinessUnitsCostPricesItemsSettingsPage.State = {

    /* ┅┅┅ PreRequirements ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Business Unit Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    businessUnits: [],
    isBusinessUnitsRetrievingInProgressOrNotStartedYet: true,
    hasBusinessUnitsRetrievingErrorOccurred: false,
    selectedBusinessUnitID: null,

    /* ╍╍╍ Currency Codes ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    codesOfAvailableCurrencies: [],
    isCodesOfAvailableCurrenciesRetrievingInProgressOrNotStartedYet: true,
    hasCodesOfAvailableCurrenciesRetrievingErrorOccurred: false,

    /* ┅┅┅ Table Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Optional Filtering ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    inputtedBusinessCostPriceItemName__fullOrPartial: "",

    /* ╍╍╍ Rows ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    tableData: [],
    rowsWithNonUniqueCompoundKeysMap: new Map(),

    /* ╍╍╍ Retrieving Status ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    hasTableDataRetrievingForCurrentFilteringNotStartedYet: true,
    isTableDataRetrievingInProgress: false,
    hasTableDataRetrievingErrorOccurred: false,

    /* ╍╍╍ Pagination ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    selectedPaginationPageNumber__numerationFrom1: 1,
    selectedItemsCountPerPaginationPage: Pagination.AvailableOptionsForItemsCountPerPageDropDownList.twenty,

    /* ╍╍╍ Currency Drop Down List ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    currencyCodeDropDownListItems: [],

    /* ┅┅┅ Updating of Data by GUI ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    hasUnsavedChanges: false,

    /* ┅┅┅ Updating of Data by Excel ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    validationErrorsForDataFromExcel: []

  };



  /* ━━━ Event Bus ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private get stickyMessageAtom(): StickyMessageAtomClassComponentAdapter.API {
    return this.reactReferences.stickyMessageAtom.current ??
        ((): never => { throw new Error("期待に反し、「StickyMessageAtomClassComponentAdapter」が未初期化。"); })();
  }


  /* ━━━ Constructor ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public constructor(props: BusinessUnitsCostPricesItemsSettingsPage.Props) {

    super(props);

    const yearOfActualityStartingDropDownListItemsData: Array<DropDownList.ItemData> = [];
    const yearOfActualityEndingDropDownListItemsData: Array<DropDownList.ItemData> = [];

    for (
      let iteratedYear: number = BusinessUnitCostPriceItem.YearOfActualityStarting.computeEarliestOne(this.currentYear);
      iteratedYear <= BusinessUnitCostPriceItem.YearOfActualityStarting.computeLatestOne(this.currentYear);
      iteratedYear++
    ) {
      yearOfActualityStartingDropDownListItemsData.push({
        key: iteratedYear,
        value: String(iteratedYear),
        displayingNode: iteratedYear
      })
    }

    for (
      let iteratedYear: number = BusinessUnitCostPriceItem.YearOfActualityEnding.computeEarliestOne(this.currentYear);
      iteratedYear <= BusinessUnitCostPriceItem.YearOfActualityEnding.computeLatestOne(this.currentYear);
      iteratedYear++
    ) {
      yearOfActualityEndingDropDownListItemsData.push({
        key: iteratedYear,
        value: String(iteratedYear),
        displayingNode: iteratedYear
      })
    }

    this.yearOfActualityStartingDropDownListItemsData = yearOfActualityStartingDropDownListItemsData;
    this.yearOfActualityEndingDropDownListItemsData = yearOfActualityEndingDropDownListItemsData;

  }


  /* ━━━ Lifecycle Hooks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public override componentDidMount(): void {
    Promise.all([
      this.retrieveBusinessUnits(),
      this.retrieveCodesOfAvailableCurrencies()
    ]).catch((error: unknown): void => { console.error(error); });
  }

  public static getDerivedStateFromProps(
    _: BusinessUnitsCostPricesItemsSettingsPage.Props, state: BusinessUnitsCostPricesItemsSettingsPage.State
  ): Partial<BusinessUnitsCostPricesItemsSettingsPage.State> {

    const compoundKeyOfCheckedOfCheckedBusinessUnitCostPriceItems: Set<string> = new Set();

    const rowsWithNonUniqueCompoundKeysMap:
        Map< string, BusinessUnitsCostPricesItemsSettingsPage.State.TableData.RowsWithNonUniqueCompoundKeysData.Value> =
            new Map();

    for (const { compoundKey__mayBeNonUnique, businessUnitCostPriceItemLocalizedName, currencyCode } of state.tableData) {

      if (compoundKeyOfCheckedOfCheckedBusinessUnitCostPriceItems.has(compoundKey__mayBeNonUnique)) {
        rowsWithNonUniqueCompoundKeysMap.set(
          compoundKey__mayBeNonUnique,
          { businessUnitCostPriceItemLocalizedName, currencyCode }
        );
      } else {
        compoundKeyOfCheckedOfCheckedBusinessUnitCostPriceItems.add(compoundKey__mayBeNonUnique);
      }

    }

    return { rowsWithNonUniqueCompoundKeysMap };

  }


  /* ━━━ Data Retrieving ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 【整備性】 この群のメソッドの順番を呼び出される順番通り保つ事。 */

  /** @description ドロップダウン専用拠点（事実上「事業部」）を取得。拠点及び原価バージョンを選ばないと、データ表示・管理不可能。 */
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

  private async retrieveCodesOfAvailableCurrencies(): Promise<void> {

    let codesOfAvailableCurrencies: ReadonlyArray<string>;

    this.setState({
      isCodesOfAvailableCurrenciesRetrievingInProgressOrNotStartedYet: true,
      hasCodesOfAvailableCurrenciesRetrievingErrorOccurred: false
    });

    try {

      codesOfAvailableCurrencies = await this.currencyGateway.retrieveCodesOfAvailableOnes();

    } catch (error: unknown) {

      this.setState({
        hasCodesOfAvailableCurrenciesRetrievingErrorOccurred: true,
        isCodesOfAvailableCurrenciesRetrievingInProgressOrNotStartedYet: false
      });

      console.error(error);

      return;

    }


    this.setState({
      codesOfAvailableCurrencies,
      currencyCodeDropDownListItems: codesOfAvailableCurrencies.map(
        (currencyCode: string): DropDownList.ItemData =>
            ({
              key: currencyCode,
              value: currencyCode,
              displayingNode: currencyCode
            })
      ),
      isCodesOfAvailableCurrenciesRetrievingInProgressOrNotStartedYet: false,
      hasCodesOfAvailableCurrenciesRetrievingErrorOccurred: false
    });

  }

  /* 【 パフォーマンス最適化 】 可能な時、原価バージョンIDを直接渡すべき。（不可能な時もあるので、引数を任意化。） */
  private async retrieveTableData(
    {
      selectedBusinessUnitID = this.state.selectedBusinessUnitID,
      inputtedBusinessCostPriceItemName__fullOrPartial = this.state.inputtedBusinessCostPriceItemName__fullOrPartial
    }: Readonly<{
      selectedBusinessUnitID?: string | null;
      inputtedBusinessCostPriceItemName__fullOrPartial?: string;
    }> = {}
  ): Promise<void> {

    if (selectedBusinessUnitID === null) {
      throw new Error(
        "論理エラー：期待に反し「BusinessUnitsCostPricesItemsSettingsPage.retrieveTableData」が呼び出された時点" +
          "「state.selectedBusinessUnitID」か、「selectedCostPriceVersionID」か、その両方は未初期化。"
      );
    }


    let rawTableData: BusinessUnitsCostPricesItemsSettingsPageBFF.TableData;

    this.setState({
      tableData: [],
      hasTableDataRetrievingForCurrentFilteringNotStartedYet: false,
      isTableDataRetrievingInProgress: true,
      hasTableDataRetrievingErrorOccurred: false
    });

    try {

      rawTableData = await this.BFF.retrieveTableData({
        businessUnitID: selectedBusinessUnitID,
        languageTag: getTagOfCurrentLanguage(),
        ...inputtedBusinessCostPriceItemName__fullOrPartial.length > 1 ?
            { searchingByFullOrPartialBusinessUnitCostPriceName: inputtedBusinessCostPriceItemName__fullOrPartial  } :
            null
      });

    } catch (error: unknown) {

      this.setState({
        hasTableDataRetrievingErrorOccurred: true,
        isTableDataRetrievingInProgress: false
      });

      throw new Error("テーブルデータ取得中エラーが発生。", { cause: error });

    }


    this.setState({
      tableData: rawTableData.map(
        (
          rowData: BusinessUnitsCostPricesItemsSettingsPageBFF.TableData.Row,
          paginationIndependentIndex: number
        ): BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row =>
            ({
              ...rowData,
              paginationIndependentIndex,
              isNew: false,
              compoundKey__mayBeNonUnique: BusinessUnitCostPriceItem.generateCompoundKeyWhichMustBeUnique(rowData)
            })
      ),
      isTableDataRetrievingInProgress: false,
      hasTableDataRetrievingErrorOccurred: false
    });

  }


  /* ━━━ Actions Handling ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 【整備性】 この群のメソッドの順番を画面に該当しているコントロールが配置してある順番（上から下へ、左から右へ）に合わせる事。 */

  /* ┅┅┅ Action Bar ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private async onBusinessUnitItemSelected(selectedBusinessUnitID: string): Promise<void> {

    if (this.state.hasUnsavedChanges) {

      const isFineToDiscardUnsavedChanges: boolean = await ConfirmationDialog.executeSession({
        title: this.getLocalizedString("confirmationSubdialog.title"),
        question: this.getLocalizedString("confirmationSubdialog.question"),
        isDangerAction: true,
        confirmationButtonLabel: this.getLocalizedString("confirmationSubdialog.buttons.confirmation.label"),
        cancellationButtonLabel: this.getLocalizedString("confirmationSubdialog.buttons.cancellation.label")
      });

      if (!isFineToDiscardUnsavedChanges) {
        return;
      }

    }


    this.setState({
      selectedBusinessUnitID,
      tableData: [],
      hasUnsavedChanges: false
    });

    return this.retrieveTableData({ selectedBusinessUnitID });

  }

  private async onNewSearchByFullOrPartialBusinessCostPriceItemNameRequested(
    inputtedBusinessCostPriceItemName__fullOrPartial: string
  ): Promise<void> {

    if (this.state.hasUnsavedChanges) {

      const isFineToDiscardUnsavedChanges: boolean = await ConfirmationDialog.executeSession({
        title: this.getLocalizedString("confirmationSubdialog.title"),
        question: this.getLocalizedString("confirmationSubdialog.question"),
        isDangerAction: true,
        confirmationButtonLabel: this.getLocalizedString("confirmationSubdialog.buttons.confirmation.label"),
        cancellationButtonLabel: this.getLocalizedString("confirmationSubdialog.buttons.cancellation.label")
      });

      if (!isFineToDiscardUnsavedChanges) {
        return;
      }

    }

    this.setState({
      inputtedBusinessCostPriceItemName__fullOrPartial,
      hasUnsavedChanges: false
    });

    return this.retrieveTableData({ inputtedBusinessCostPriceItemName__fullOrPartial });

  }


  /* ╍╍╍ Excel File ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  private onExcelFileUploadingButtonClicked(): void {
    this.reactReferences.excelFilePicker.current?.click();
  }

  private async onExcelFilePicked(changingEvent: React.ChangeEvent<HTMLInputElement>): Promise<void> {

    const targetExcelFile: File | undefined = changingEvent.target.files?.[0];

    if (typeof targetExcelFile === "undefined") {

      this.resetExcelFilePicker();

      throw new Error(
        "論理エラー：期待に反し「businessCostPricesItemsSettingsSetupPage.onExcelFilePicked」が呼び出された時点" +
            "イベントオブジェクトにあるファイル配列が空になっている。"
      );

    }


    /* 【 方法論 】 正しい値が入っている`input`要素の`accept`アトリビュートが存在している限り、起きないので、コンソール通知だけで良い。 */
    if (
      !BusinessUnitsCostPricesItemsSettingsPage.supportedSpreadsheetsFileNameExtensionsWithLeadingDots.some(
        (supportedSpreadsheetFilenameExtensionWithLeadingDot: string): boolean =>
            targetExcelFile.name.endsWith(supportedSpreadsheetFilenameExtensionWithLeadingDot)
      )
    ) {
      console.error(`ファイル「${ targetExcelFile.name }」はサポートされていないファイル名拡張子を含めている。`);
      this.resetExcelFilePicker();
      return;
    }


    Backdrop.display({ accessibilityGuidance: "guidances.screenReaderOnly.excelFileExportingInProgress" });

    let rawUpdatedBusinessCostPriceItemRequestData:
        ReadonlyArray<BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.RowRawData>;

    try {

      rawUpdatedBusinessCostPriceItemRequestData = await ExcelHelper.parseFile({
        targetFile: targetExcelFile,
        buildItem: (cellsContent: ReadonlyArray<unknown>): BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.RowRawData => {

          const endingYearAndMonth__YYYYMM__possiblyEmpty: string = String(
            cellsContent[BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ColumnsIndexes.endingYearAndMonth]
          );

          return {
            businessUnitCostPriceItemID:
                cellsContent[BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ColumnsIndexes.businessUnitCostPriceItemID],
            startingYearAndMonth__YYYYMM: String(
              cellsContent[BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ColumnsIndexes.startingYearAndMonth]
            ),
            endingYearAndMonth__YYYYMM:
                endingYearAndMonth__YYYYMM__possiblyEmpty.length > 0 ?
                    endingYearAndMonth__YYYYMM__possiblyEmpty : null,
            currencyCode:
                cellsContent[BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ColumnsIndexes.currencyCode],
            isAmountValid:
                cellsContent[BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ColumnsIndexes.isAmountValid],
            isRateValid:
                cellsContent[BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ColumnsIndexes.isRateValid],
            isCalculationValid:
                cellsContent[BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ColumnsIndexes.isCalculationValid],
            isDataLinkageAvailable:
                cellsContent[BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ColumnsIndexes.hasBeenCreatedAutomatically]
          };

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


     const rawUpdatedBusinessCostItemRequestDataValidationResult:
        BusinessUnitsCostPricesItemsDataValidator.
            ValidationResult<BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData.Item> =
                BusinessUnitsCostPricesItemsDataValidator.validate(
                  rawUpdatedBusinessCostPriceItemRequestData,
                  {
                    codesOfAvailableCurrencies: new Set(this.state.codesOfAvailableCurrencies),
                    referenceYear: this.currentYear,
                    dataPurpose: BusinessUnitsCostPricesItemsDataValidator.DataPurposes.updating
                  }
                );

    if (rawUpdatedBusinessCostItemRequestDataValidationResult.isInvalid) {

      this.setState({
        validationErrorsForDataFromExcel: rawUpdatedBusinessCostItemRequestDataValidationResult.
            validationErrorsDataForEachItem.map(
              (
                {
                  itemIndex,
                  dataForEachError
                }: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorsDataForSpecificItem
              ): BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ValidationErrorsForSpecificLine =>
                  ({
                    lineNumber: itemIndex + 2,
                    localizedMessages: dataForEachError.map(
                      ({ code, ...parameters }: BusinessUnitsCostPricesItemsDataValidator.ValidationErrorData): string =>
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

      await this.businessUnitCostPriceItemGateway.updateMultiple(
        rawUpdatedBusinessCostItemRequestDataValidationResult.items
      );

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

  }

  private onExcelFileDownloadingButtonClicked(): void {

    try {

        ExcelHelper.writeDataToFile({
          headerCellsContent: [
            "ID",
            this.getLocalizedString("table.headers.businessUnitCostPriceCode"),
            this.getLocalizedString("table.headers.businessUnitCostPriceItemLocalizedName"),
            this.getLocalizedString("table.headers.yearAndMonthOfActualityStarting"),
            this.getLocalizedString("table.headers.yearAndMonthOfActualityEnding"),
            this.getLocalizedString("table.headers.currencyCode"),
            this.getLocalizedString("table.headers.isAmountValid"),
            this.getLocalizedString("table.headers.isRateValid"),
            this.getLocalizedString("table.headers.isCalculationValid"),
            this.getLocalizedString("table.headers.isDataLinkageAvailable")
          ],
          bodyCellsContent: this.state.tableData,
          transformItemToCellsArray: (
            {
              businessUnitCostPriceItemID,
              businessUnitCostPriceItemCode,
              businessUnitCostPriceItemLocalizedName,
              yearAndMonthOfActualityStarting,
              yearAndMonthOfActualityEnding,
              currencyCode,
              isAmountValid,
              isRateValid,
              isCalculationValid,
              isDataLinkageAvailable
            }: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row
          ): Array<string | number | boolean> =>
              [
                businessUnitCostPriceItemID,
                businessUnitCostPriceItemCode,
                businessUnitCostPriceItemLocalizedName,
                yearAndMonthOfActualityStarting.year +
                    yearAndMonthOfActualityStarting.monthNumber__numerationFrom1__always2Digits,
                yearAndMonthOfActualityEnding === null ?
                    "" :
                    (
                      yearAndMonthOfActualityEnding.year +
                          yearAndMonthOfActualityEnding.monthNumber__numerationFrom1__always2Digits
                    ),
                currencyCode,
                isAmountValid,
                isRateValid,
                isCalculationValid,
                isDataLinkageAvailable
              ],
          outputFileNameWithExtension: "cost_item_setting_sample.xlsx"
        });

      } catch (error: unknown) {

        console.error("XLSXファイル生成の際エラーが発生", error);

        this.stickyMessageAtom.addErrorMessage({
          text: this.getLocalizedString("errors.exportingToExcelFileFailed")
        });

      }

  }


  /* ╍╍╍ Date Saving ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  private async onDataSavingButtonClicked(): Promise<void> {

    if (this.state.selectedBusinessUnitID === null) {
      throw new Error(
        "論理エラー：期待に反し「BusinessUnitsCostPricesItemsSettingsPage.onDataSavingButtonClicked」が呼び出された時点" +
          "「state.selectedBusinessUnitID」は未初期化。"
      );
    }


    Backdrop.display({ accessibilityGuidance: "guidances.screenReaderOnly.dataSavingInProgress" });

    const newItems: Array<BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData.NewItem> = [];
    const updatedItems: Array<BusinessUnitCostPriceItemGateway.ManagementOfMultipleOnes.RequestData.UpdatedItem> = [];

    for (const tableRowData of this.state.tableData) {
      if (
        tableRowData.businessUnitCostPriceItemID.
            startsWith(BusinessUnitsCostPricesItemsSettingsPage.TEMPORARY_BUSINESS_UNIT_COST_PRICE_ITEM_ID_PREFIX)
      ) {

        newItems.push({
          businessUnitCostPriceCodeID: tableRowData.businessUnitCostPriceCodeID,
          startingYearAndMonth__YYYYMM:
            tableRowData.yearAndMonthOfActualityStarting.year +
                    tableRowData.yearAndMonthOfActualityStarting.monthNumber__numerationFrom1__always2Digits,
          endingYearAndMonth__YYYYMM:
              tableRowData.yearAndMonthOfActualityEnding === null ?
                  null :
                  tableRowData.yearAndMonthOfActualityEnding.year +
                      tableRowData.yearAndMonthOfActualityEnding.monthNumber__numerationFrom1__always2Digits,
          currencyCode: tableRowData.currencyCode,
          isAmountValid: tableRowData.isAmountValid,
          isRateValid: tableRowData.isRateValid,
          isCalculationValid: tableRowData.isCalculationValid,
          isDataLinkageAvailable: tableRowData.isDataLinkageAvailable
        });

      } else {

        updatedItems.push({
          businessUnitCostPriceItemID: tableRowData.businessUnitCostPriceItemID,
          startingYearAndMonth__YYYYMM:
            tableRowData.yearAndMonthOfActualityStarting.year +
                    tableRowData.yearAndMonthOfActualityStarting.monthNumber__numerationFrom1__always2Digits,
          endingYearAndMonth__YYYYMM:
              tableRowData.yearAndMonthOfActualityEnding === null ?
                  null :
                  tableRowData.yearAndMonthOfActualityEnding.year +
                      tableRowData.yearAndMonthOfActualityEnding.monthNumber__numerationFrom1__always2Digits,
          currencyCode: tableRowData.currencyCode,
          isAmountValid: tableRowData.isAmountValid,
          isRateValid: tableRowData.isRateValid,
          isCalculationValid: tableRowData.isCalculationValid,
          isDataLinkageAvailable: tableRowData.isDataLinkageAvailable,
        });

      }
    }

    try {

      await this.businessUnitCostPriceItemGateway.manageMultiple({
        newItems,
        updatedItems,
        businessUnitID: this.state.selectedBusinessUnitID
      });

    } catch (error: unknown) {

      console.error(error);

      this.stickyMessageAtom.addErrorMessage({ text: this.getLocalizedString("errors.dataSavingFailed") });

      return;

    } finally {

      Backdrop.dismiss();

    }


    this.stickyMessageAtom.addSuccessMessage({ text: this.getLocalizedString("guidances.dataSavingSucceeded") });

    this.setState({ hasUnsavedChanges: false });

    this.retrieveTableData().catch((error: unknown): void => { console.error(error); });

  }



  /* ┅┅┅ Table ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ Actuality Period ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  /* ─── Starting ─────────────────────────────────────────────────────────────────────────────────────────────────── */
  private onNewYearActualityStartingSelected(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    newYearOfActualityStarting: number
  ): void {

    if (
      targetItem.yearAndMonthOfActualityEnding !== null &&
          new Date(
          newYearOfActualityStarting,
          targetItem.yearAndMonthOfActualityStarting.monthNumber__numerationFrom1 - 1
        ).getTime() >
            new Date(
              targetItem.yearAndMonthOfActualityEnding.year,
              targetItem.yearAndMonthOfActualityEnding.monthNumber__numerationFrom1 - 1
            ).getTime()
    )  {

      this.stickyMessageAtom.addErrorMessage({
        text: this.getLocalizedString(
          "errors.invalidDataInputtingPrevention.yearAndMonthOfActualityStartingIsLaterThanYearAndMonthOfActualityEnding"
        )
      });

      return;

    }


    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        {
          ...targetItem,
          yearAndMonthOfActualityStarting: {
            ...targetItem.yearAndMonthOfActualityStarting,
            year: newYearOfActualityStarting
          }
        }
      ),
      hasUnsavedChanges: true
    });

  }

  private onSelectNewMonthActualityStarting(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    newMonthNumberOfActualityStarting__numerationFrom1: number
  ): void {

    if (
      targetItem.yearAndMonthOfActualityEnding !== null &&
        new Date(
          targetItem.yearAndMonthOfActualityStarting.year,
          newMonthNumberOfActualityStarting__numerationFrom1 - 1
        ).getTime() >
            new Date(
              targetItem.yearAndMonthOfActualityEnding.year,
              targetItem.yearAndMonthOfActualityEnding.monthNumber__numerationFrom1 - 1
            ).getTime()
    ) {

      this.stickyMessageAtom.addErrorMessage({
        text: this.getLocalizedString(
          "errors.invalidDataInputtingPrevention.yearAndMonthOfActualityStartingIsLaterThanYearAndMonthOfActualityEnding"
        )
      });

      return;

    }

    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        {
          ...targetItem,
          yearAndMonthOfActualityStarting: {
            ...targetItem.yearAndMonthOfActualityStarting,
            monthNumber__numerationFrom1: newMonthNumberOfActualityStarting__numerationFrom1,
            monthNumber__numerationFrom1__always2Digits:
                String(newMonthNumberOfActualityStarting__numerationFrom1).padEnd(2, "0")
          }
        }
      ),
      hasUnsavedChanges: true
    });

  }


  /* ─── Ending ───────────────────────────────────────────────────────────────────────────────────────────────────── */
  private onNewYearActualityEndingSelected(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    selectedOptionValue: string
  ): void {

    const newYearAndMonthOfActualityEnding:
        BusinessUnitsCostPricesItemsSettingsPageBFF.TableData.Row.YearAndMonthData | null =
            selectedOptionValue === BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE ?
                null :
                {
                  year: Number.parseInt(selectedOptionValue, 10),
                  ...targetItem.yearAndMonthOfActualityEnding === null ?
                      {
                        monthNumber__numerationFrom1: 1,
                        monthNumber__numerationFrom1__always2Digits: "01"
                      } :
                      {
                        monthNumber__numerationFrom1:
                            targetItem.yearAndMonthOfActualityEnding.monthNumber__numerationFrom1,
                        monthNumber__numerationFrom1__always2Digits:
                            targetItem.yearAndMonthOfActualityEnding.monthNumber__numerationFrom1__always2Digits
                      }
                };

    if (
      newYearAndMonthOfActualityEnding !== null &&
          new Date(
            newYearAndMonthOfActualityEnding.year,
            newYearAndMonthOfActualityEnding.monthNumber__numerationFrom1 - 1
          ).getTime() <
              new Date(
                targetItem.yearAndMonthOfActualityStarting.year,
                targetItem.yearAndMonthOfActualityStarting.monthNumber__numerationFrom1 - 1
              ).getTime()
    ) {

      this.stickyMessageAtom.addErrorMessage({
        text: this.getLocalizedString(
          "errors.invalidDataInputtingPrevention.yearAndMonthOfActualityEndingIsEarlierThanYearAndMonthOfActualityStarting"
        )
      });

      return;

    }


    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        {
          ...targetItem,
          yearAndMonthOfActualityEnding: newYearAndMonthOfActualityEnding
        }
      ),
      hasUnsavedChanges: true
    });

  }

  private onSelectNewMonthActualityEnding(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    selectedOptionValue: string
  ): void {

    const newYearAndMonthOfActualityEnding:
        BusinessUnitsCostPricesItemsSettingsPageBFF.TableData.Row.YearAndMonthData | null =
            selectedOptionValue === BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE ?
                null :
                {
                  year: targetItem.yearAndMonthOfActualityEnding === null ?
                      targetItem.yearAndMonthOfActualityStarting.year + 1 :
                      targetItem.yearAndMonthOfActualityEnding.year,
                  monthNumber__numerationFrom1: Number.parseInt(selectedOptionValue, 10),
                  monthNumber__numerationFrom1__always2Digits: selectedOptionValue.padEnd(2, "0")
                };

    if (
      newYearAndMonthOfActualityEnding !== null &&
          new Date(
            newYearAndMonthOfActualityEnding.year,
            newYearAndMonthOfActualityEnding.monthNumber__numerationFrom1 - 1
          ).getTime() <
              new Date(
                targetItem.yearAndMonthOfActualityStarting.year,
                targetItem.yearAndMonthOfActualityStarting.monthNumber__numerationFrom1 - 1
              ).getTime()
    ) {

      this.stickyMessageAtom.addErrorMessage({
        text: this.getLocalizedString(
          "errors.invalidDataInputtingPrevention.yearAndMonthOfActualityEndingIsEarlierThanYearAndMonthOfActualityStarting"
        )
      });

      return;

    }


    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        {
          ...targetItem,
          yearAndMonthOfActualityEnding:
              selectedOptionValue ===
                  BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE ?
                      null :
                      {
                        year: targetItem.yearAndMonthOfActualityEnding === null ?
                            targetItem.yearAndMonthOfActualityStarting.year + 1 :
                            targetItem.yearAndMonthOfActualityEnding.year,
                        monthNumber__numerationFrom1: Number.parseInt(selectedOptionValue, 10),
                        monthNumber__numerationFrom1__always2Digits: selectedOptionValue.padEnd(2, "0")
                      }
        }
      ),
      hasUnsavedChanges: true
    });

  }


  /* ┅┅┅ Currency Code ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private onNewCurrencyCodeSelected(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    newCurrencyCode: string
  ): void {
    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        {
          ...targetItem,
          currencyCode: newCurrencyCode,
          compoundKey__mayBeNonUnique: BusinessUnitCostPriceItem.generateCompoundKeyWhichMustBeUnique({
            businessUnitCostPriceCodeID: targetItem.businessUnitCostPriceCodeID,
            currencyCode: newCurrencyCode
          })
        }
      ),
      hasUnsavedChanges: true
    });
  }

  /* ┅┅┅ Booleans ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private onAmountValidityCheckboxValueChanged(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    isAmountValidNow: boolean
  ): void {
    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        { ...targetItem, isAmountValid: isAmountValidNow }
      ),
      hasUnsavedChanges: true
    });
  }

  private onRateValidityCheckboxValueChanged(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    isRateValidNow: boolean
  ): void {
    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        { ...targetItem, isRateValid: isRateValidNow }
      ),
      hasUnsavedChanges: true
    });
  }

  private onCalculationValidityCheckboxValueChanged(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    isCalculationValidNow: boolean
  ): void {
    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        { ...targetItem, isCalculationValid: isCalculationValidNow }
      ),
      hasUnsavedChanges: true
    });
  }

  private onDataLinkageAvailabilityCheckboxValueChanged(
    targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row,
    isDataLinkageAvailableNow: boolean
  ): void {
    this.setState({
      tableData: this.state.tableData.toSpliced(
        targetItem.paginationIndependentIndex,
        1,
        {
          ...targetItem,
          isDataLinkageAvailable: isDataLinkageAvailableNow
        }
      ),
      hasUnsavedChanges: true
    });
  }


  /* ┅┅┅ Row Duplication ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private onRowDuplicationButtonClicked(targetItem: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row): void {
    this.setState({
      tableData: [
        ...this.state.tableData.slice(0, targetItem.paginationIndependentIndex + 1),
        {
          ...targetItem,
          businessUnitCostPriceItemID:
              BusinessUnitsCostPricesItemsSettingsPage.TEMPORARY_BUSINESS_UNIT_COST_PRICE_ITEM_ID_PREFIX +
              crypto.randomUUID(),
          paginationIndependentIndex: targetItem.paginationIndependentIndex + 1,
          isNew: true
        },
        ...this.state.tableData.slice(targetItem.paginationIndependentIndex + 1).map(
          (
            tableRowData: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row, indexAmonRemainOnes: number
          ): BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row =>
              ({
                ...tableRowData,
                paginationIndependentIndex:  targetItem.paginationIndependentIndex + 2 + indexAmonRemainOnes
              })
        )
      ],
      hasUnsavedChanges: true
    });
  }


  /* ┅┅┅ Pagination ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private onPaginationChanged(
    { newPageNumber__numerationFrom1, newItemsCountPerPaginationPage }: Pagination.ChangingEventData
  ): void {
    this.setState({
      selectedPaginationPageNumber__numerationFrom1: newPageNumber__numerationFrom1,
      selectedItemsCountPerPaginationPage: newItemsCountPerPaginationPage
    })
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
    )
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
          loading={
            this.state.isBusinessUnitsRetrievingInProgressOrNotStartedYet ||
                this.state.hasBusinessUnitsRetrievingErrorOccurred
          }
          isVerticalOrientation={ true }
          className={ CSS_Classes["actionBar-dropDownList"] }
        />

        <TextBox
          label={ this.getLocalizedString("controls.searchingBoxes.businessCostPriceItemName.label") }
          value={ this.state.inputtedBusinessCostPriceItemName__fullOrPartial  }
          onChangeEventHandler={
            (inputtedValue: string): void => {
              this.setState({ inputtedBusinessCostPriceItemName__fullOrPartial: inputtedValue });
            }
          }
          onBlurEventHandler={ this.onNewSearchByFullOrPartialBusinessCostPriceItemNameRequested.bind(this) }
          disabled={ this.state.selectedBusinessUnitID === null }
          className={ CSS_Classes["actionBar-dropDownList"] }
        />

        {
          /*
           * TODO
           * 既存データから重複がなくったら、`disabled`条件を
           * `this.state.hasUnsavedChanges || this.state.rowsWithNonUniqueCompoundKeysMap.size > 0`
           * に変える。
           * 【 関連課題 】 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/84
           */
        }
        <Button
          onClick={ this.onDataSavingButtonClicked.bind(this) }
          className={ CSS_Classes["actionBar-button"] }
          disabled={ !this.state.hasUnsavedChanges }
        >
          { this.getLocalizedString("controls.buttons.dataSaving.label") }
        </Button>

        <Button
          onClick={ this.onExcelFileUploadingButtonClicked.bind(this) }
          className={ CSS_Classes["actionBar-button"] }
          disabled={
            this.state.isCodesOfAvailableCurrenciesRetrievingInProgressOrNotStartedYet ||
                this.state.hasCodesOfAvailableCurrenciesRetrievingErrorOccurred
          }
        >
          { this.getLocalizedString("controls.buttons.excelFileUploading.label") }
        </Button>

        <Button
          onClick={ this.onExcelFileDownloadingButtonClicked.bind(this) }
          className={ CSS_Classes["actionBar-button"] }
          disabled={
            this.state.hasTableDataRetrievingForCurrentFilteringNotStartedYet ||
                this.state.isTableDataRetrievingInProgress ||
                this.state.hasTableDataRetrievingErrorOccurred ||
                this.state.tableData.length === 0
          }
        >
          { this.getLocalizedString("controls.buttons.excelFileDownloading.label") }
        </Button>

         <input
          ref={ this.reactReferences.excelFilePicker }
          type="file"
          accept={ BusinessUnitsCostPricesItemsSettingsPage.supportedSpreadsheetsFileNameExtensionsWithLeadingDots.join(",") }
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

      ...this.state.hasCodesOfAvailableCurrenciesRetrievingErrorOccurred ?
          [
            <Alert
              severity={ Alert.Severities.error }
              className={ CSS_Classes.alert }
              actionButton={{
                label: this.getLocalizedString("controls.buttons.codesOfAvailableCurrenciesRetrievingRetrying.label"),
                onClickEventHandler: this.retrieveCodesOfAvailableCurrencies.bind(this)
              }}
              key="ERROR_MESSAGE-CODES_OR_AVAILABLE_CURRENCIES_RETRIEVING_FAILED"
            >
              { this.getLocalizedString("errors.codesOfAvailableCurrenciesRetrievingFailed") }
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
              <p className={ `${ CSS_Classes["validationErrorsMessage-intro"] }` }>
                { this.getLocalizedString("errors.excelFileValidation.intro") }
              </p>
              <dl className={ CSS_Classes["validationErrorsMessage-twoDimensionalList"] }>
                {
                  this.state.validationErrorsForDataFromExcel.map(
                    (
                      {
                        lineNumber,
                        localizedMessages
                      }: BusinessUnitsCostPricesItemsSettingsPage.ExcelFile.ValidationErrorsForSpecificLine
                    ): React.ReactNode =>
                        (
                          <React.Fragment key={ lineNumber }>
                            <dt>{ this.getLocalizedString("errors.excelFileValidation.lineNumberTitle", { lineNumber }) }</dt>
                            <dd>
                              <ul className={ CSS_Classes["validationErrorsMessage-plainList"] }>
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
                  )
                }
              </dl>
            </Alert>
          ] :
          [],

      ...this.state.rowsWithNonUniqueCompoundKeysMap.size > 0 ?
          [
            <Alert
              severity={ Alert.Severities.error }
              className={ CSS_Classes.alert }
              onClickDismissingButton={ (): void => { this.setState({ validationErrorsForDataFromExcel: [] }) } }
              key="ERROR_MESSAGE-EXCEL_FILE_VALIDATION"
            >
              <p className={ `${ CSS_Classes["validationErrorsMessage-intro"] }` }>
                { this.getLocalizedString("errors.checkingForDuplications.intro") }
              </p>
              <ul className={ CSS_Classes["validationErrorsMessage-plainList"] }>
                {
                  Array.from(this.state.rowsWithNonUniqueCompoundKeysMap.entries()).
                      map(
                        (
                          [
                            compoundKey,
                            { businessUnitCostPriceItemLocalizedName, currencyCode }
                          ]: Readonly<[
                            string,
                            BusinessUnitsCostPricesItemsSettingsPage.State.TableData.RowsWithNonUniqueCompoundKeysData.Value
                          ]>
                        ): React.ReactNode =>
                            (
                              <li key={ compoundKey }>
                                {
                                  this.getLocalizedString(
                                    "errors.checkingForDuplications.row",
                                    { businessUnitCostPriceItemLocalizedName, currencyCode }
                                  )
                                }
                              </li>
                            )
                      )
                }
              </ul>
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

  private get tableHeader(): React.ReactNode {
    return (
      <TableHeader className="bg-[#00388E] text-white">
        <TableRow>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.businessUnitCostPriceCode") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.businessUnitCostPriceItemLocalizedName") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.yearAndMonthOfActualityStarting") }
          </TableHead>

          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.yearAndMonthOfActualityEnding") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.currencyCode") }
          </TableHead>
          <TableHead
            id="BUSINESS_UNITS_COST_PRICES_ITEMS_SETTINGS_PAGE-TABLE_HEADING_CELL-IS_AMOUNT_VALID"
            className={ CSS_Classes["table-headerCell"] }
          >
            { this.getLocalizedString("table.headers.isAmountValid") }
          </TableHead>
          <TableHead
            id="BUSINESS_UNITS_COST_PRICES_ITEMS_SETTINGS_PAGE-TABLE_HEADING_CELL-IS_RATE_VALID"
            className={ CSS_Classes["table-headerCell"]
          }>
            { this.getLocalizedString("table.headers.isRateValid") }
          </TableHead>
          <TableHead
            id="BUSINESS_UNITS_COST_PRICES_ITEMS_SETTINGS_PAGE-TABLE_HEADING_CELL-IS_CALCULATION_VALID"
            className={ CSS_Classes["table-headerCell"] }
          >
            { this.getLocalizedString("table.headers.isCalculationValid") }
          </TableHead>
          <TableHead
            id="BUSINESS_UNITS_COST_PRICES_ITEMS_SETTINGS_PAGE-TABLE_HEADING_CELL-IS_DATA_LINKAGE_AVAILABLE"
            className={ CSS_Classes["table-headerCell"] }
          >
            { this.getLocalizedString("table.headers.isDataLinkageAvailable") }
          </TableHead>
          <TableHead className={ CSS_Classes["table-headerCell"] }>
            { this.getLocalizedString("table.headers.actions") }
          </TableHead>
        </TableRow>
      </TableHeader>
    );
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
                    <div className="flex items-center">
                      <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                      <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                      <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                      <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                    </div>
                  </TableCell>
                  <TableCell className={ CSS_Classes["table-bodyCell"] }>
                    <div className="flex items-center justify-center">
                      <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                      <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                      <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                      <span className={ CSS_Classes["table-loadingPlaceholder"] }></span>
                    </div>
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

    const indexOfFirstPaginationPageItem: number =
        (this.state.selectedPaginationPageNumber__numerationFrom1 - 1) * this.state.selectedItemsCountPerPaginationPage;

    const indexOfLastPaginationPageItem: number =
        indexOfFirstPaginationPageItem +  this.state.selectedItemsCountPerPaginationPage - 1;

    return (
      <>

        <Table className={ CSS_Classes.table }>
          { this.tableHeader }
          <TableBody className="bg-white">
            {
              (this.state.tableData.slice(indexOfFirstPaginationPageItem, indexOfLastPaginationPageItem + 1)).map(
                (rowData: BusinessUnitsCostPricesItemsSettingsPage.State.TableData.Row): React.ReactNode => (
                  <TableRow
                    key={ rowData.businessUnitCostPriceItemID }
                    className={
                      [
                        CSS_Classes["table-row"],
                        ...this.state.rowsWithNonUniqueCompoundKeysMap.has(rowData.compoundKey__mayBeNonUnique) ?
                            [ CSS_Classes["table-row__duplicate"] ] : []
                      ].join(" ")
                    }
                  >

                    { /* ╍╍╍ Business Unit Cost Price Code ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      { rowData.businessUnitCostPriceItemCode }
                    </TableCell>

                    { /* ╍╍╍ Business Unit Cost Price Item Localized Name ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>

                      { rowData.businessUnitCostPriceItemLocalizedName }

                      {
                        rowData.isNew ?
                            (
                              <span
                                className={
                                  `${ CSS_Classes["table-bodyCell-badge"] } ${ CSS_Classes["table-bodyCell-badge__normal"] }`
                                }
                              >
                                { this.getLocalizedString("table.labels.new") }
                              </span>
                            ) :
                            null
                      }

                      {
                        this.state.rowsWithNonUniqueCompoundKeysMap.has(rowData.compoundKey__mayBeNonUnique) ?
                            (
                              <span
                                className={
                                  `${ CSS_Classes["table-bodyCell-badge"] } ${ CSS_Classes["table-bodyCell-badge__danger"] }`
                                }
                              >
                                { this.getLocalizedString("table.labels.hasDuplicate") }
                              </span>
                            ) :
                            null
                      }

                    </TableCell>

                    { /* ╍╍╍ Year and Month of Actuality Starting ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>

                      <DropDownList
                        accessibilityGuidance={
                          this.getLocalizedString("controls.dropDownLists.yearOfActualityStarting.accessibilityGuidance")
                        }
                        itemsData={ this.yearOfActualityStartingDropDownListItemsData }
                        value={ String(rowData.yearAndMonthOfActualityStarting.year) }
                        onValueChange={
                          (newYearOfActualityStarting: string): void => {
                            this.onNewYearActualityStartingSelected(rowData, Number.parseInt(newYearOfActualityStarting, 10))
                          }
                        }
                        isVerticalOrientation={ false }
                        className={
                          `${ CSS_Classes["table-bodyCell-dropDownList"] } ${ CSS_Classes["table-bodyCell-dropDownList__year"] }`
                        }
                      />
                      <span
                        className={ CSS_Classes["table-bodyCell-label"]
                      }>
                        { this.getLocalizedString("table.labels.year") }
                      </span>

                      <DropDownList
                        accessibilityGuidance={
                          this.getLocalizedString("controls.dropDownLists.monthOfActualityStarting.accessibilityGuidance")
                        }
                        itemsData={ this.monthDropDownListsData }
                        value={ String(rowData.yearAndMonthOfActualityStarting.monthNumber__numerationFrom1) }
                        onValueChange={
                          (newMonthNumberOfActualityStarting__numerationFrom1: string): void => {
                            this.onSelectNewMonthActualityStarting(
                              rowData, Number.parseInt(newMonthNumberOfActualityStarting__numerationFrom1, 10)
                            )
                          }
                        }
                        isVerticalOrientation={ false }
                        className={
                          `${ CSS_Classes["table-bodyCell-dropDownList"] } ${ CSS_Classes["table-bodyCell-dropDownList__month"] }`
                        }
                      />
                      <span
                        className={ CSS_Classes["table-bodyCell-label"] }
                      >
                        { this.getLocalizedString("table.labels.month") }
                      </span>

                    </TableCell>


                    { /* ╍╍╍ Year and Month of Actuality Ending ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>

                      <DropDownList
                        accessibilityGuidance={
                          this.getLocalizedString("controls.dropDownLists.yearOfActualityEnding.accessibilityGuidance")
                        }
                        itemsData={
                          [
                            ...this.yearOfActualityEndingDropDownListItemsData,
                            {
                              key: BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE,
                              value: BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE,
                              displayingNode: this.getLocalizedString(
                                "controls.dropDownLists.yearOfBusinessUnitsCostPricesItemActualityEnding.emptyOptionLabel"
                              )
                            }
                          ]
                        }
                        value={
                          rowData.yearAndMonthOfActualityEnding === null ?
                              BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE :
                              String(rowData.yearAndMonthOfActualityEnding.year)
                        }
                        onValueChange={
                          (selectedOption__possiblyEmpty: string): void => {
                            this.onNewYearActualityEndingSelected(rowData, selectedOption__possiblyEmpty)
                          }
                        }
                        isVerticalOrientation={ false }
                        className={
                          `${ CSS_Classes["table-bodyCell-dropDownList"] } ${ CSS_Classes["table-bodyCell-dropDownList__year"] }`
                        }
                      />
                      <span
                        className={ CSS_Classes["table-bodyCell-label"] }
                      >
                        { this.getLocalizedString("table.labels.year") }
                      </span>

                      <DropDownList
                        accessibilityGuidance={
                          this.getLocalizedString("controls.dropDownLists.monthOfActualityEnding.accessibilityGuidance")
                        }
                        itemsData={
                          [
                            ...this.monthDropDownListsData,
                            {
                              key: BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE,
                              value: BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE,
                              displayingNode: this.getLocalizedString(
                                "controls.dropDownLists.monthOfBusinessUnitsCostPricesItemActualityEnding.emptyOptionLabel"
                              )
                            }
                          ]
                        }
                        value={
                          rowData.yearAndMonthOfActualityEnding === null ?
                              BusinessUnitsCostPricesItemsSettingsPage.DROP_DOWN_LIST_EMPTY_SELECTION_KEY_OF_VALUE :
                              String(rowData.yearAndMonthOfActualityEnding.monthNumber__numerationFrom1)
                        }
                        onValueChange={
                          (selectedOption__possiblyEmpty: string): void => {
                            this.onSelectNewMonthActualityEnding(
                              rowData, selectedOption__possiblyEmpty
                            )
                          }
                        }
                        isVerticalOrientation={ false }
                        className={
                          `${ CSS_Classes["table-bodyCell-dropDownList"] } ${ CSS_Classes["table-bodyCell-dropDownList__month"] }`
                        }
                      />
                      <span
                        className={ CSS_Classes["table-bodyCell-label"] }
                      >
                        { this.getLocalizedString("table.labels.month") }
                      </span>

                    </TableCell>

                    { /* ╍╍╍ Year and Month of Actuality Ending ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      <DropDownList
                        itemsData={ this.state.currencyCodeDropDownListItems }
                        value={ String(rowData.currencyCode) }
                        onValueChange={
                          (newCurrencyCode: string): void => {
                            this.onNewCurrencyCodeSelected(rowData, newCurrencyCode)
                          }
                        }
                        isVerticalOrientation={ false }
                        className={
                          `${ CSS_Classes["table-bodyCell-dropDownList"] } ${ CSS_Classes["table-bodyCell-dropDownList__month"] }`
                        }
                      />
                    </TableCell>

                    { /* ╍╍╍ Is Amound Valid ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      <Checkbox
                        checked={ rowData.isAmountValid }
                        onCheckedChange={
                          (isCheckedNow: boolean): void => {
                            this.onAmountValidityCheckboxValueChanged(rowData, isCheckedNow)
                          }
                        }
                        aria-labelledby="BUSINESS_UNITS_COST_PRICES_ITEMS_SETTINGS_PAGE-TABLE_HEADING_CELL-IS_AMOUNT_VALID"
                      />
                    </TableCell>

                    { /* ╍╍╍ Is Rate Valid ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      <Checkbox
                        checked={ rowData.isRateValid }
                        onCheckedChange={
                          (isCheckedNow: boolean): void => {
                            this.onRateValidityCheckboxValueChanged(rowData, isCheckedNow)
                          }
                        }
                        aria-labelledby="BUSINESS_UNITS_COST_PRICES_ITEMS_SETTINGS_PAGE-TABLE_HEADING_CELL-IS_RATE_VALID"
                      />
                    </TableCell>

                    { /* ╍╍╍ Is Calculation Valid ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      <Checkbox
                        checked={ rowData.isCalculationValid }
                        onCheckedChange={
                          (isCheckedNow: boolean): void => {
                            this.onCalculationValidityCheckboxValueChanged(rowData, isCheckedNow)
                          }
                        }
                        aria-labelledby="BUSINESS_UNITS_COST_PRICES_ITEMS_SETTINGS_PAGE-TABLE_HEADING_CELL-IS_CALCULATION_VALID"
                      />
                    </TableCell>

                    { /* ╍╍╍ Is Data Linkage Available ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      <Checkbox
                        checked={ rowData.isDataLinkageAvailable }
                        onCheckedChange={
                          (isCheckedNow: boolean): void => {
                            this.onDataLinkageAvailabilityCheckboxValueChanged(rowData, isCheckedNow)
                          }
                        }
                        aria-labelledby="BUSINESS_UNITS_COST_PRICES_ITEMS_SETTINGS_PAGE-TABLE_HEADING_CELL-IS_DATA_LINKAGE_AVAILABLE"
                      />
                    </TableCell>

                    { /* ╍╍╍ Actions ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */ }
                    <TableCell className={ CSS_Classes["table-bodyCell"] }>
                      <Button
                        onClick={ (): void => { this.onRowDuplicationButtonClicked(rowData) } }
                        size="md"
                      >
                        { this.getLocalizedString("controls.buttons.rowDuplicating.label") }
                      </Button>
                    </TableCell>

                  </TableRow>
                )
              )
            }
          </TableBody>
        </Table>

        <Pagination
          selectedPageNumber__numerationFrom1={ this.state.selectedPaginationPageNumber__numerationFrom1 }
          itemsCountPerPaginationPage={ this.state.selectedItemsCountPerPaginationPage }
          totalItemsCount={ this.state.tableData.length }
          onChangeEventHandler={ this.onPaginationChanged.bind(this) }
          className={ CSS_Classes["table-pagination"]  }
        />

      </>
    );
  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private getLocalizedString(pathWithoutNamespace: string, options?: I18n.TOptions): ReturnType<typeof I18n["t"]> {
    return this.props.t(pathWithoutNamespace, options);
  }

  private resetExcelFilePicker(): void {
    (this.reactReferences.excelFilePicker.current ?? { value: "" }).value = "";
  }

}


namespace BusinessUnitsCostPricesItemsSettingsPage {

  /* ━━━ Props ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Props = Readonly<{

    /** @description 【 ライブラリ制限 】 「react-i18next」に注射されるため、Props上名前変更不可能。 */
    t: I18n.TFunction;

  }>;


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type State = Readonly<{

    /* ┅┅┅ PreRequirements ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Business Unit Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    businessUnits: ReadonlyArray<BusinessUnit>;
    isBusinessUnitsRetrievingInProgressOrNotStartedYet: boolean;
    hasBusinessUnitsRetrievingErrorOccurred: boolean;
    selectedBusinessUnitID: string | null;

    /* ╍╍╍ Currency Codes ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    codesOfAvailableCurrencies: ReadonlyArray<string>;
    isCodesOfAvailableCurrenciesRetrievingInProgressOrNotStartedYet: boolean;
    hasCodesOfAvailableCurrenciesRetrievingErrorOccurred: boolean;

    /* ┅┅┅ Table Data ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Optional Filtering ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    inputtedBusinessCostPriceItemName__fullOrPartial: string;

    /* ╍╍╍ Rows ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    tableData: BusinessUnitsCostPricesItemsSettingsPage.State.TableData;
    rowsWithNonUniqueCompoundKeysMap: State.TableData.RowsWithNonUniqueCompoundKeysMap;

    /* ╍╍╍ Retrieving Status ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    hasTableDataRetrievingForCurrentFilteringNotStartedYet: boolean;
    isTableDataRetrievingInProgress: boolean;
    hasTableDataRetrievingErrorOccurred: boolean;

    /* ╍╍╍ Pagination ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    selectedPaginationPageNumber__numerationFrom1: number;
    selectedItemsCountPerPaginationPage: number;

    /* ╍╍╍ Currency Drop Down List ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    currencyCodeDropDownListItems: ReadonlyArray<DropDownList.ItemData>;

    /* ┅┅┅ Updating of Data by GUI ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    hasUnsavedChanges: boolean;

    /* ┅┅┅ Updating of Data by Excel ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    validationErrorsForDataFromExcel: ReadonlyArray<ExcelFile.ValidationErrorsForSpecificLine>;

  }>;

  export namespace State {

    export type TableData = ReadonlyArray<TableData.Row>;

    export namespace TableData {

      export type Row =
          BusinessUnitsCostPricesItemsSettingsPageBFF.TableData.Row &
          Readonly<{
            paginationIndependentIndex: number;
            isNew: boolean;
            compoundKey__mayBeNonUnique: string;
          }>;

      export type RowsWithNonUniqueCompoundKeysMap = ReadonlyMap<
        BusinessUnitCostPriceItem.UniqueCompoundKey,
        RowsWithNonUniqueCompoundKeysData.Value
      >;

      export namespace RowsWithNonUniqueCompoundKeysData {
        export type Value = Pick<
          BusinessUnitsCostPricesItemsSettingsPageBFF.TableData.Row,
            "businessUnitCostPriceItemLocalizedName" |
            "currencyCode"
        >;
      }

    }

  }


  export namespace ExcelFile {

    export type RowRawData = Readonly<{
      [ keys in keyof BusinessUnitCostPriceItemGateway.UpdatingOfMultipleOnes.RequestData.Item ]: unknown;
    }>;

    export enum ColumnsIndexes {
      businessUnitCostPriceItemID = 0,
      startingYearAndMonth = 3,
      endingYearAndMonth = 4,
      currencyCode = 5,
      isAmountValid = 6,
      isRateValid = 7,
      isCalculationValid = 8,
      hasBeenCreatedAutomatically = 9
    }

    export type ValidationErrorsForSpecificLine = {
      lineNumber: number;
      localizedMessages: ReadonlyArray<string>;
    }

  }

}


export default withTranslation(BusinessUnitsCostPricesItemsSettingsPage.I18N_Namespace)(BusinessUnitsCostPricesItemsSettingsPage);
