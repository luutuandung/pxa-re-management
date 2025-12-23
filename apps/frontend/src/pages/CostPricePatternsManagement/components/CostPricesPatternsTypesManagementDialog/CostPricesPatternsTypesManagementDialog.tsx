import {

  /* ┅┅┅ Business Rules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricesPatternsCategoriesDataTypes,

  /* ╍╍╍ Gateways ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  type CostPricePatternTypeGateway,

  /* ┅┅┅ BFF ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricePatternsManagementPageBFF,
  TagsOfSupportedLanguages,

  /* ┅┅┅ Validations ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  CostPricePatternTypeValidator,

  /* ┅┅┅ Constants ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  PRODUCT_NUMBER_CATEGORY_TYPE_ID

} from "@pxa-re-management/shared";

/* ┅┅┅ Assets ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CSS_Classes from "./CostPricesPatternsTypesManagementDialog.module.sass";

/* ┅┅┅ Event Bus ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { StickyMessageAtomClassComponentAdapter } from "@/store/stickyMessage.ts";

/* ┅┅┅ GUI Components ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import Button from "@/components/atoms/Button.tsx";
import Alert from "@/components/molecules/Alert.tsx";
import TextBox from "@/components/molecules/TextBox/TextBox.tsx";
import Backdrop from "@/components/molecules/Backdrop.tsx";
import CostPricePatternsCategoriesManager from "./../CostPricePatternsCategoriesManager/CostPricePatternsCategoriesManager.tsx";
import DropDownList from "@/components/molecules/DropDownList/DropDownList.tsx";
import ConfirmationDialog from "@/components/organisms/ConfirmationDialog.tsx";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as React from "react";
import { withTranslation } from "react-i18next";
import * as I18n from "i18next";

/* ┅┅┅ Utils ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import ClientDependenciesInjector from "@/dependencies-injection/ClientDependenciesInjector.ts";
import { getTagOfCurrentLanguage } from "@/i18n";


class CostPricesPatternsTypesManagementDialog extends React.Component<
  CostPricesPatternsTypesManagementDialog.Props, CostPricesPatternsTypesManagementDialog.State
> {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static readonly I18N_Namespace: string = "costPricesPatternsTypesManagementDialog";


  /* ━━━ Non-reactive Instance Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ Dependencies ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly costPricePatternTypeGateway: CostPricePatternTypeGateway =
      ClientDependenciesInjector.gateways.costPricePatternType;

  private readonly costPricePatternsManagementPageBFF: CostPricePatternsManagementPageBFF =
      ClientDependenciesInjector.BFF.pages.costPricePatternsManagement;


  /* ┅┅┅ React References ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  private readonly reactReferences: Readonly<{
    stickyMessageAtom: React.RefObject<StickyMessageAtomClassComponentAdapter.API | null>;
    costPricePatternJapaneseNameTextBox: React.RefObject<TextBox.PublicMethods | null>;
    modelCategoriesManager: React.RefObject<CostPricePatternsCategoriesManager | null>;
    salesCategoriesManager: React.RefObject<CostPricePatternsCategoriesManager | null>;
    retailCategoriesManager: React.RefObject<CostPricePatternsCategoriesManager | null>;
  }> = {
    stickyMessageAtom: React.createRef(),
    costPricePatternJapaneseNameTextBox: React.createRef(),
    modelCategoriesManager: React.createRef(),
    salesCategoriesManager: React.createRef(),
    retailCategoriesManager: React.createRef()
  };

  private get modelCategoriesManager(): CostPricePatternsCategoriesManager {
    return this.reactReferences.modelCategoriesManager.current ??
      ((): never => { throw new Error("期待に反し、「this.reactReferences.modelCategoriesManager.current」は未だnull。") })()
  }

  private get salesCategoriesManager(): CostPricePatternsCategoriesManager {
    return this.reactReferences.salesCategoriesManager.current ??
      ((): never => { throw new Error("期待に反し、「this.reactReferences.salesCategoriesManager.current」は未だnull。") })()
  }

  private get retailCategoriesManager(): CostPricePatternsCategoriesManager {
    return this.reactReferences.retailCategoriesManager.current ??
      ((): never => { throw new Error("期待に反し、「this.reactReferences.retailCategoriesManager.current」は未だnull。") })()
  }


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static getInitialState(): CostPricesPatternsTypesManagementDialog.State {
    return {

      /* ┅┅┅ Requirements ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
      /* ╍╍╍ Model Categories Types Drop Down List Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
      modelCategoriesTypesDropDownListItems: [],
      isModelCategoriesTypesDropDownListItemsRetrievingInProgressOrNotStartedYet: true,
      hasModelCategoriesTypesDropDownListItemsRetrievingErrorOccurred: false,

      /* ╍╍╍ Sales Categories Drop Down List Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
      salesCategoriesDropDownListItems: [],
      isSalesCategoriesDropDownListItemsRetrievingInProgressOrNotStartedYet: true,
      hasSalesCategoriesDropDownListItemsRetrievingErrorOccurred: false,


      /* ┅┅┅ Cost Prices Patterns Types List Item Selecting ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
      selectedCostPricesPatternsTypesListItem: null,

      /* ┅┅┅ Inputs Form ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
      isNewCostPricePatternInputtingMode: false,
      hasUnsavedChanges: false,
      mustDisplayValidationErrorsMessages: false,
      validationErrorsMessages: [],

      costPricePatternJapaneseNameTextBoxValue: "",
      costPricePatternEnglishNameTextBoxValue: "",
      costPricePatternChineseNameTextBoxValue: "",

      modelCategoriesManagerPayload: [],
      salesCategoriesManagerPayload: [],
      retailCategoriesManagerPayload: []

    };
  }

  public state: CostPricesPatternsTypesManagementDialog.State = CostPricesPatternsTypesManagementDialog.getInitialState();


  /* ━━━ Event Bus ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private get stickyMessageAtom(): StickyMessageAtomClassComponentAdapter.API {
    return this.reactReferences.stickyMessageAtom.current ??
        ((): never => { throw new Error("期待に反し、「StickyMessageAtomClassComponentAdapter」が未初期化。"); })();
  }


  /* ━━━ Lifecycle Hooks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public override componentDidMount(): void {
    Promise.
        all([
          this.retrieveModelCategoriesTypesDropDownListItems(),
          this.retrieveSalesCategoriesDropDownListItems()
        ]).
        catch((error: unknown): void => { console.error(error); });
  }


  /* ━━━ Data Retrieving ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private async retrieveModelCategoriesTypesDropDownListItems(): Promise<void> {

    let modelCategoriesTypesDropDownListItems: ReadonlyArray<
      CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.ResponseData.Item
    >;

    this.setState({
      isModelCategoriesTypesDropDownListItemsRetrievingInProgressOrNotStartedYet: true,
      hasModelCategoriesTypesDropDownListItemsRetrievingErrorOccurred: false
    });

    try {

      modelCategoriesTypesDropDownListItems = await this.costPricePatternsManagementPageBFF.
          retrieveModelCategoriesTypesDropDownListItems({
            businessUnitID: this.props.targetBusinessUnitID,
            languageTag: getTagOfCurrentLanguage()
          });

    } catch (error: unknown) {

      this.setState({
        hasModelCategoriesTypesDropDownListItemsRetrievingErrorOccurred: true,
        isModelCategoriesTypesDropDownListItemsRetrievingInProgressOrNotStartedYet: false
      });

      console.error(error);

      return;

    }


    this.setState({
      modelCategoriesTypesDropDownListItems: modelCategoriesTypesDropDownListItems.map(
        (
          {
            modelCategoryTypeID,
            modelCategoryLocalizedName
          }: CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.ModelCategoriesTypes.ResponseData.Item
        ): DropDownList.ItemData =>
            ({
              key: modelCategoryTypeID,
              value: modelCategoryTypeID,
              displayingNode: modelCategoryLocalizedName
            })
      ),
      isModelCategoriesTypesDropDownListItemsRetrievingInProgressOrNotStartedYet: false,
      hasModelCategoriesTypesDropDownListItemsRetrievingErrorOccurred: false
    });

  }

  private async retrieveSalesCategoriesDropDownListItems(): Promise<void> {

    let salesCategoriesDropDownListItems: ReadonlyArray<
      CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.ResponseData.Item
    >;

    this.setState({
      isSalesCategoriesDropDownListItemsRetrievingInProgressOrNotStartedYet: true,
      hasSalesCategoriesDropDownListItemsRetrievingErrorOccurred: false
    });

    try {

      salesCategoriesDropDownListItems = await this.costPricePatternsManagementPageBFF.
          retrieveSalesCategoriesDropDownListItems({ languageTag: getTagOfCurrentLanguage() });

    } catch (error: unknown) {

      this.setState({
        hasSalesCategoriesDropDownListItemsRetrievingErrorOccurred: true,
        isSalesCategoriesDropDownListItemsRetrievingInProgressOrNotStartedYet: false
      });

      console.error(error);

      return;

    }


    this.setState({
      salesCategoriesDropDownListItems: salesCategoriesDropDownListItems.map(
        (
          {
            salesCategoryTypeID,
            salesCategoryLocalizedName
          }: CostPricePatternsManagementPageBFF.DropDropListsItemsRetrieving.SalesCategories.ResponseData.Item
        ): DropDownList.ItemData =>
            ({
              key: salesCategoryTypeID,
              value: salesCategoryTypeID,
              displayingNode: salesCategoryLocalizedName
            })
      ),
      isSalesCategoriesDropDownListItemsRetrievingInProgressOrNotStartedYet: false,
      hasSalesCategoriesDropDownListItemsRetrievingErrorOccurred: false
    });

  }


  /* ━━━ Actions Handing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private async onSelectExistingCostPricePattern(rowIndex: number): Promise<void> {

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


    const selectedCostPricePatternListItem:
        CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item =
            this.props.costPricesPatternsTypesListItems[rowIndex];

    this.setState(
      {
        selectedCostPricesPatternsTypesListItem: selectedCostPricePatternListItem,
        hasUnsavedChanges: false,
        costPricePatternJapaneseNameTextBoxValue: selectedCostPricePatternListItem.costPricePatternNames.japanese,
        costPricePatternEnglishNameTextBoxValue: selectedCostPricePatternListItem.costPricePatternNames.english,
        costPricePatternChineseNameTextBoxValue: selectedCostPricePatternListItem.costPricePatternNames.chinese,
        modelCategoriesManagerPayload: this.modelCategoriesManager.
            setCategoriesAndGetPayload(selectedCostPricePatternListItem.orderedPricesPatternsCategories.model),
        salesCategoriesManagerPayload: this.salesCategoriesManager.
            setCategoriesAndGetPayload(selectedCostPricePatternListItem.orderedPricesPatternsCategories.sales),
        retailCategoriesManagerPayload: this.retailCategoriesManager.
            setCategoriesAndGetPayload(selectedCostPricePatternListItem.orderedPricesPatternsCategories.retail),
      },
      this.validateInputtedData.bind(this)
    );

  }

  private async onBeginInputtingOfNewCostPricePatternButtonClicked(): Promise<void> {

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


    this.setState(
      {
        selectedCostPricesPatternsTypesListItem: null,
        isNewCostPricePatternInputtingMode: true,
        hasUnsavedChanges: false,
        validationErrorsMessages: [],
        costPricePatternJapaneseNameTextBoxValue: "",
        costPricePatternEnglishNameTextBoxValue: "",
        costPricePatternChineseNameTextBoxValue: "",
        modelCategoriesManagerPayload: this.modelCategoriesManager.setCategoriesAndGetPayload([]),
        salesCategoriesManagerPayload: this.salesCategoriesManager.setCategoriesAndGetPayload([]),
        retailCategoriesManagerPayload: this.retailCategoriesManager.setCategoriesAndGetPayload([])
      },
      (): void => {
        this.reactReferences.costPricePatternJapaneseNameTextBox.current?.focus();
        this.validateInputtedData();
      }
    );

  }

  private async onSavingButtonClicked(): Promise<void> {

    const validationResult: CostPricePatternTypeValidator.ValidationResult = this.validateInputtedData();

    if (validationResult.isInvalid) {
      this.setState({ mustDisplayValidationErrorsMessages: true });
      return;
    }


    Backdrop.display({
      accessibilityGuidance: this.getLocalizedString(
        "guidances.screenReaderOnly." + (
          this.state.selectedCostPricesPatternsTypesListItem === null ?
              "newCostPricePatternDataSubmittingInProgress" : "existingCostPricePatternDataSubmittingInProgress"
        )
      )
    });

    try {

      if (this.state.selectedCostPricesPatternsTypesListItem === null) {

        await this.costPricePatternTypeGateway.addOne({
          costPricePatternNames: validationResult.validData.costPricePatternNames,
          costPricePatternCategories: validationResult.validData.costPricePatternCategories,
          businessUnitID: this.props.targetBusinessUnitID
        });

      } else {

        await this.costPricePatternTypeGateway.updateOne({
          costPricePatternNames: validationResult.validData.costPricePatternNames,
          costPricePatternID: this.state.selectedCostPricesPatternsTypesListItem.costPricePatternID
        })

      }

    } catch (error: unknown) {

      this.stickyMessageAtom.addErrorMessage({
        text: this.getLocalizedString(
          "errors." + (
            this.state.selectedCostPricesPatternsTypesListItem === null ?
              "newCostPricePatternDataSubmittingFailed" : "existingCostPricePatternDataSubmittingFailed"
          )
        )
      });

      console.error(error);

      return;

    } finally {

      Backdrop.dismiss();

    }


    this.stickyMessageAtom.addSuccessMessage({
      text: this.getLocalizedString(
        "guidances." + (
          this.state.selectedCostPricesPatternsTypesListItem === null ?
            "newCostPricePatternDataSubmittingSuccess" : "existingCostPricePatternDataSubmittingSuccess"
        )
      )
    });

    this.setState({
      isNewCostPricePatternInputtingMode: false,
      hasUnsavedChanges: false,
      mustDisplayValidationErrorsMessages: false,
      validationErrorsMessages: [],
      selectedCostPricesPatternsTypesListItem: null,
      costPricePatternJapaneseNameTextBoxValue: "",
      costPricePatternEnglishNameTextBoxValue: "",
      costPricePatternChineseNameTextBoxValue: "",
      modelCategoriesManagerPayload: this.modelCategoriesManager.setCategoriesAndGetPayload([]),
      salesCategoriesManagerPayload: this.salesCategoriesManager.setCategoriesAndGetPayload([]),
      retailCategoriesManagerPayload: this.retailCategoriesManager.setCategoriesAndGetPayload([])
    });

    this.props.onCostPricesPatternsTypesListRefreshingRequestedEventHandler();

  }

  private async onClosingButtonClicked(): Promise<void> {

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


    this.props.onManagedToCloseEventHandler();

  }


  /* ━━━ Rendering ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public render(): React.ReactElement {

    const mustDisableControls: boolean =
        this.state.selectedCostPricesPatternsTypesListItem === null && !this.state.isNewCostPricePatternInputtingMode;

    return (
      <Dialog open={ true }>

        <DialogContent
          showCloseButton={ false }
          className={ CSS_Classes.content }
        >

        { /*【 方法論：radix-ui 】 常に見えなくてもも良いが、radix-ui上必要な部分。 */}
        <DialogDescription className="sr-only">{ this.getLocalizedString("heading") }</DialogDescription>

        <DialogHeader>
          <DialogTitle>
            { this.getLocalizedString("heading") }
          </DialogTitle>
        </DialogHeader>

        <div className={ CSS_Classes.body }>

          <div className={ CSS_Classes.listGroup }>

            <div id="COST_PRICE_PATTERNS_MANAGEMENT_PAGE-PATTERN_DIALOG-LIST_TITLE">
              { this.getLocalizedString("listView.title") }
            </div>

            <Button
              size="sm"
              onClick={ this.onBeginInputtingOfNewCostPricePatternButtonClicked.bind(this) }
            >
              { this.getLocalizedString("controls.buttons.beingInputtingOfNewCostPricesPatternData.label") }
            </Button>

            { this.listBox }

          </div>

          <div className={ CSS_Classes.inputsForm }>

            {
              this.state.mustDisplayValidationErrorsMessages && this.state.validationErrorsMessages.length > 0 ?
              (
                <Alert
                  severity={ Alert.Severities.error }
                  className={ CSS_Classes.alert }
                >
                  <p>{ this.getLocalizedString("errors.validation.intro") }</p>
                  <ul>
                    {
                      this.state.validationErrorsMessages.map(
                        (validationErrorMessage: string): React.ReactNode =>
                          (<li key={ validationErrorMessage }>{ validationErrorMessage }</li>)
                      )
                    }
                  </ul>
                </Alert>
              ) :
              null
            }

            <TextBox
              label={ this.getLocalizedString("controls.textBoxes.costPricePatternNames.japanese.label") }
              value={ this.state.costPricePatternJapaneseNameTextBoxValue  }
              onChangeEventHandler={
                (inputtedValue: string): void => {
                  this.setState(
                    {
                      costPricePatternJapaneseNameTextBoxValue: inputtedValue,
                      hasUnsavedChanges: true
                    },
                    this.validateInputtedData.bind(this)
                  );
                }
              }
              disabled={ mustDisableControls }
              className={ CSS_Classes.textBox }
              ref={ this.reactReferences.costPricePatternJapaneseNameTextBox }
            />

            <TextBox
              label={ this.getLocalizedString("controls.textBoxes.costPricePatternNames.english.label") }
              value={ this.state.costPricePatternEnglishNameTextBoxValue }
              onChangeEventHandler={
                (inputtedValue: string): void => {
                  this.setState(
                    {
                      costPricePatternEnglishNameTextBoxValue: inputtedValue,
                      hasUnsavedChanges: true
                    },
                    this.validateInputtedData.bind(this)
                  );
                }
              }
              disabled={ mustDisableControls }
              className={ CSS_Classes.textBox }
            />

            <TextBox
              label={ this.getLocalizedString("controls.textBoxes.costPricePatternNames.chinese.label") }
              value={ this.state.costPricePatternChineseNameTextBoxValue }
              onChangeEventHandler={
                (inputtedValue: string): void => {
                  this.setState(
                    {
                      costPricePatternChineseNameTextBoxValue: inputtedValue,
                      hasUnsavedChanges: true
                    },
                    this.validateInputtedData.bind(this)
                  );
                }
              }
              disabled={ mustDisableControls }
              className={ CSS_Classes.textBox }
            />

            <CostPricePatternsCategoriesManager
              title={ this.getLocalizedString("controls.costPricePatternsCategoriesManagers.modelsCategories.title") }
              isCategoriesDropDownListDataNotReadyYet={
                this.state.isModelCategoriesTypesDropDownListItemsRetrievingInProgressOrNotStartedYet
              }
              categoriesDropDownListItemsData={
                [
                  ...this.state.modelCategoriesTypesDropDownListItems,
                  {
                    key: PRODUCT_NUMBER_CATEGORY_TYPE_ID,
                    value: PRODUCT_NUMBER_CATEGORY_TYPE_ID,
                    displayingNode: this.getLocalizedString("labels.productNumber")
                  }
                ]
              }
              readonly={ this.state.selectedCostPricesPatternsTypesListItem !== null }
              disabled={ mustDisableControls }
              onUpdatingEventHandler={
                (updatingEventPayload: CostPricePatternsCategoriesManager.UpdatingEventPayload): void => {
                  this.setState(
                    {
                      modelCategoriesManagerPayload: updatingEventPayload,
                      hasUnsavedChanges: true
                    },
                    this.validateInputtedData.bind(this)
                  );
                }
              }
              className={ CSS_Classes.costPricePatternsCategoriesManager }
              ref={ this.reactReferences.modelCategoriesManager }
            />

            <CostPricePatternsCategoriesManager
              title={ this.getLocalizedString("controls.costPricePatternsCategoriesManagers.salesCategories.title") }
              isCategoriesDropDownListDataNotReadyYet={
                this.state.isSalesCategoriesDropDownListItemsRetrievingInProgressOrNotStartedYet
              }
              categoriesDropDownListItemsData={ this.state.salesCategoriesDropDownListItems }
              readonly={ this.state.selectedCostPricesPatternsTypesListItem !== null }
              disabled={ mustDisableControls }
              onUpdatingEventHandler={
                (updatingEventPayload: CostPricePatternsCategoriesManager.UpdatingEventPayload): void => {
                  this.setState(
                    {
                      salesCategoriesManagerPayload: updatingEventPayload,
                      hasUnsavedChanges: true
                    },
                    this.validateInputtedData.bind(this)
                  );
                }
              }
              className={ CSS_Classes.costPricePatternsCategoriesManager }
              ref={ this.reactReferences.salesCategoriesManager }
            />

            <CostPricePatternsCategoriesManager
              title={ this.getLocalizedString("controls.costPricePatternsCategoriesManagers.resailingCategories.title") }
              isCategoriesDropDownListDataNotReadyYet={
                this.state.isSalesCategoriesDropDownListItemsRetrievingInProgressOrNotStartedYet
              }
              categoriesDropDownListItemsData={ this.state.salesCategoriesDropDownListItems }
              readonly={ this.state.selectedCostPricesPatternsTypesListItem !== null }
              disabled={ mustDisableControls }
              onUpdatingEventHandler={
                (updatingEventPayload: CostPricePatternsCategoriesManager.UpdatingEventPayload): void => {
                  this.setState(
                    {
                      retailCategoriesManagerPayload: updatingEventPayload,
                      hasUnsavedChanges: true
                    },
                    this.validateInputtedData.bind(this)
                  );
                }
              }
              className={ CSS_Classes.costPricePatternsCategoriesManager }
              ref={ this.reactReferences.retailCategoriesManager }
            />

            <Button
              onClick={ this.onSavingButtonClicked.bind(this) }
              className={ CSS_Classes.button }
              disabled={ mustDisableControls }
            >
              { this.getLocalizedString( "controls.buttons.savingOfNewCostPricePattern.label") }
            </Button>

          </div>

        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={ this.onClosingButtonClicked.bind(this) }
          >
            { this.getLocalizedString( "controls.buttons.closing.label") }
          </Button>
        </DialogFooter>

       </DialogContent>

        <StickyMessageAtomClassComponentAdapter adapterReference={ this.reactReferences.stickyMessageAtom } />

      </Dialog>

    );

  }

  private get listBox(): React.ReactNode {

    const tagOfCurrentLanguage: TagsOfSupportedLanguages = getTagOfCurrentLanguage();

    if (this.props.isCostPricesPatternsTypesListItemsRetrievingInProgress) {
      <div
        className={ CSS_Classes.listBox }
        role="presentation"
      >
        <div className="sr-only">{ this.getLocalizedString("guidances.screenReaderOnly.tableDataLoadingInProgress") }</div>
        {
          Array.from(new Array(10).keys()).map(
            (rowNumber: number): React.ReactNode => (
              <div
                key={ rowNumber }
                className={ CSS_Classes["listBox-item--loadingPlaceholder"] }
              />
            )
          )
        }
      </div>
    }


    if (this.props.hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred) {
      return (
        <Alert
          severity={ Alert.Severities.error }
          actionButton={
            {
              label: this.getLocalizedString("controls.buttons.retryingOfCostPricesPatternsListItemsRetrieving.label"),
              onClickEventHandler: this.props.onCostPricesPatternsTypesListRefreshingRequestedEventHandler.bind(this)
            }
          }
          className={ CSS_Classes.alert }
        >
          { this.getLocalizedString("errors.costPricesPatternsListItemsRetrievingFailed") }
        </Alert>
      );
    }


    if (this.props.costPricesPatternsTypesListItems.length === 0) {
      return (
        <Alert
          severity={ Alert.Severities.info }
          className={ CSS_Classes.alert }
        >
          { this.getLocalizedString("guidances.noCostPricesPatternsListItems") }
        </Alert>
      );
    }


    /* 【 参考 】 https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Reference/Roles/radio_role */
    return (
      <div
        className={ CSS_Classes.listBox }
        role="radiogroup"
        aria-labelledby="COST_PRICE_PATTERNS_MANAGEMENT_PAGE-PATTERN_DIALOG-LIST_TITLE"
        aria-disabled={
          this.props.isCostPricesPatternsTypesListItemsRetrievingInProgress ||
              this.props.hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred ||
              this.props.costPricesPatternsTypesListItems.length === 0
        }
      >
        {
          this.props.costPricesPatternsTypesListItems.map(
            (
              {
                costPricePatternID,
                costPricePatternNames
              }: CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item,
              rowIndex: number
            ): React.ReactNode => {

              const ITEM_REUSABLE_KEY: string = `MODEL_CATEGORIES_TYPES_LIST_ITEM-${ costPricePatternID }`;
              const isSelected: boolean =
                  costPricePatternID === this.state.selectedCostPricesPatternsTypesListItem?.costPricePatternID;

              return (
                <label
                  id={ ITEM_REUSABLE_KEY }
                  className={
                    [
                      CSS_Classes["listBox-item"],
                      ...isSelected ? [ CSS_Classes["listBox-item__selectedState"] ] : []
                    ].join(" ")
                  }
                  key={ ITEM_REUSABLE_KEY }
                  onClick={ (): void => { this.onSelectExistingCostPricePattern(rowIndex) } }
                >
                  <span
                    role="radio"
                    tabIndex={ 0 }
                    aria-labelledby={ ITEM_REUSABLE_KEY }
                    aria-checked={ isSelected }
                    className={ CSS_Classes["listBox-item-radioButton"] }
                  />
                  {
                    {
                      [TagsOfSupportedLanguages.japanese]: costPricePatternNames.japanese,
                      [TagsOfSupportedLanguages.english]: costPricePatternNames.english,
                      [TagsOfSupportedLanguages.chinese]: costPricePatternNames.chinese
                    }[tagOfCurrentLanguage]
                  }
                </label>
              );

            }
          )
        }
      </div>
    );

  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private validateInputtedData(): CostPricePatternTypeValidator.ValidationResult {

    const validationResult: CostPricePatternTypeValidator.ValidationResult =  CostPricePatternTypeValidator.validate(
      {
        costPricePatternNames: {
          japanese: this.state.costPricePatternJapaneseNameTextBoxValue,
          english: this.state.costPricePatternEnglishNameTextBoxValue,
          chinese: this.state.costPricePatternChineseNameTextBoxValue
        },
        ...this.state.selectedCostPricesPatternsTypesListItem === null ?
          {
            costPricePatternCategories: [
              ...this.state.modelCategoriesManagerPayload.map(
                (
                  costPricePatternCategoryData: CostPricePatternsCategoriesManager.UpdatingEventPayload.CostPricePatternCategoryData,
                  index: number
                ): CostPricePatternTypeGateway.AddingOfOne.RequestData.CostPricePatternCategory =>
                    ({
                      dataType: CostPricesPatternsCategoriesDataTypes.model,
                      typeID: costPricePatternCategoryData.typeID,
                      sequenceNumber: index + 1
                    })
              ),
              ...this.state.salesCategoriesManagerPayload.map(
                (
                  costPricePatternCategoryData: CostPricePatternsCategoriesManager.UpdatingEventPayload.CostPricePatternCategoryData,
                  index: number
                ): CostPricePatternTypeGateway.AddingOfOne.RequestData.CostPricePatternCategory =>
                    ({
                      dataType: CostPricesPatternsCategoriesDataTypes.sales,
                      typeID: costPricePatternCategoryData.typeID,
                      sequenceNumber: index + 1
                    })
              ),
              ...this.state.retailCategoriesManagerPayload.map(
                (
                  costPricePatternCategoryData: CostPricePatternsCategoriesManager.UpdatingEventPayload.CostPricePatternCategoryData,
                  index: number
                ): CostPricePatternTypeGateway.AddingOfOne.RequestData.CostPricePatternCategory =>
                    ({
                      dataType: CostPricesPatternsCategoriesDataTypes.retail,
                      typeID: costPricePatternCategoryData.typeID,
                      sequenceNumber: index + 1
                    })
              )
            ]
          } :
          null
      },
      {
        categoriesCheckingStrategy: this.state.selectedCostPricesPatternsTypesListItem === null ?
            CostPricePatternTypeValidator.Options.CategoriesCheckingStrategy.quantityOnly :
            CostPricePatternTypeValidator.Options.CategoriesCheckingStrategy.expectingNoCategories
      }
    );

    this.setState({
      validationErrorsMessages: validationResult.isInvalid ?
        validationResult.validationErrorsData.map(
          ({ code, ...parameters }: CostPricePatternTypeValidator.ValidationErrorData): string =>
              this.getLocalizedString(`errors.validation.${ code }`, parameters)
        ) :
        []
    });

    return validationResult;

  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private getLocalizedString(pathWithoutNamespace: string, options?: I18n.TOptions): ReturnType<typeof I18n["t"]> {
    return this.props.t(pathWithoutNamespace, options);
  }

}


namespace CostPricesPatternsTypesManagementDialog {

  /* ━━━ Props ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Props = Readonly<{

    targetBusinessUnitID: string;

    costPricesPatternsTypesListItems: ReadonlyArray<
      CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item
    >;

    isCostPricesPatternsTypesListItemsRetrievingInProgress: boolean;

    hasCostPricesPatternsTypesListItemsRetrievingErrorOccurred: boolean;

    onCostPricesPatternsTypesListRefreshingRequestedEventHandler: () => unknown;

    onManagedToCloseEventHandler: () => unknown;

    /** @description 【 ライブラリ制限 】 「react-i18next」に注射されるため、Props上名前変更不可能。 */
    t: I18n.TFunction;

  }>;


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type State = Readonly<{

    /* ┅┅┅ Requirements ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    /* ╍╍╍ Model Categories Types Drop Down List Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    modelCategoriesTypesDropDownListItems: ReadonlyArray<DropDownList.ItemData>;
    isModelCategoriesTypesDropDownListItemsRetrievingInProgressOrNotStartedYet: boolean;
    hasModelCategoriesTypesDropDownListItemsRetrievingErrorOccurred: boolean;

    /* ╍╍╍ Sales Categories Drop Down List Items ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
    salesCategoriesDropDownListItems: ReadonlyArray<DropDownList.ItemData>;
    isSalesCategoriesDropDownListItemsRetrievingInProgressOrNotStartedYet: boolean;
    hasSalesCategoriesDropDownListItemsRetrievingErrorOccurred: boolean;


    /* ┅┅┅ Cost Prices Patterns Types List Item Selecting ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    selectedCostPricesPatternsTypesListItem:
        CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item | null;


    /* ┅┅┅ Inputs Form ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
    isNewCostPricePatternInputtingMode: boolean;
    hasUnsavedChanges: boolean;
    mustDisplayValidationErrorsMessages: boolean;
    validationErrorsMessages: ReadonlyArray<string>;

    costPricePatternJapaneseNameTextBoxValue: string;
    costPricePatternEnglishNameTextBoxValue: string;
    costPricePatternChineseNameTextBoxValue: string;

    modelCategoriesManagerPayload: CostPricePatternsCategoriesManager.UpdatingEventPayload;
    salesCategoriesManagerPayload: CostPricePatternsCategoriesManager.UpdatingEventPayload;
    retailCategoriesManagerPayload: CostPricePatternsCategoriesManager.UpdatingEventPayload;

  }>;

}


export default withTranslation(CostPricesPatternsTypesManagementDialog.I18N_Namespace)(CostPricesPatternsTypesManagementDialog);
