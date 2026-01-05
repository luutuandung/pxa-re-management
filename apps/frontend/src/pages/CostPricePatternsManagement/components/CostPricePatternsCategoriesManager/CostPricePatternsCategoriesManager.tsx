/* ┅┅┅ Business Rules ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import { CostPricePatternsManagementPageBFF } from "@pxa-re-management/shared";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as React from "react";
import I18n from "i18next";

/* ┅┅┅ Assets ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CSS_Classes from "./CostPricePatternsCategoriesManager.module.sass";

/* ┅┅┅ GUI Components ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import Button from "@/components/atoms/Button.tsx";
import DropDownList from "@/components/molecules/DropDownList/DropDownList.tsx";


class CostPricePatternsCategoriesManager extends React.Component<
  CostPricePatternsCategoriesManager.Props,
  CostPricePatternsCategoriesManager.State
> {

  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public readonly state: CostPricePatternsCategoriesManager.State = {
    costPricesPatternsCategoriesData: CostPricePatternsCategoriesManager.getDataForInitialDisplaying(),
    noCategoriesTypesAvailable: false
  };


  /* ━━━ Initialization ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private static getDataForInitialDisplaying(): ReadonlyArray<
    CostPricePatternsCategoriesManager.State.CostPricePatternCategoryData
  > {
    return [
      {
        ID: `TEMPORARY_ID-${ window.crypto.randomUUID() }`,
        selectedTypeID: null
      }
    ];
  }


  /* ━━━ Interface ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* 【 方法論 】
   * React上コンポーネントのメソッドをそとから呼び出す事は非推薦ではあるが、この場合オブジェクト型要素の配列型のpropsを監視するより親とのデータ交換しやすい。 */
  public setCategoriesAndGetPayload(
    costPricesPatternsCategoriesExternalData: ReadonlyArray<
      CostPricePatternsManagementPageBFF.CostPricesPatternsTypesListItemsRetrieving.ResponseData.Item.
          OrderedPricesPatternsCategoriesData.Item
    >
  ): CostPricePatternsCategoriesManager.UpdatingEventPayload {

    const costPricesPatternsCategoriesData:
        ReadonlyArray<CostPricePatternsCategoriesManager.State.CostPricePatternCategoryData> =
            costPricesPatternsCategoriesExternalData.length > 0 ?
                costPricesPatternsCategoriesExternalData.map(
                  ({ costPricePatternCategoryID, costPricePatternCategoryTypeID }) => ({
                    ID: costPricePatternCategoryID,
                    selectedTypeID: costPricePatternCategoryTypeID
                  })
                ) :
                CostPricePatternsCategoriesManager.getDataForInitialDisplaying();

    this.setState({ costPricesPatternsCategoriesData });

    return CostPricePatternsCategoriesManager.buildNewestPayload(costPricesPatternsCategoriesData);

  }


  /* ━━━ Lifecycle Hooks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  protected static getDerivedStateFromProps(
    newProps: CostPricePatternsCategoriesManager.Props
  ): Partial<CostPricePatternsCategoriesManager.State> {
    return {
      noCategoriesTypesAvailable:
          !newProps.isCategoriesDropDownListDataNotReadyYet && newProps.categoriesDropDownListItemsData.length === 0
    };
  }


  /* ━━━ Actions Handling ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* 【 整備性 】 該当しているコントローラーが表示されている通り、右から左へ、上から下の順番を保つ事。 */

  private onSwapingWithPreviousCategoryButtonClicked(targetRowIndex: number): void {
    this.setState(
      {
        costPricesPatternsCategoriesData: this.state.costPricesPatternsCategoriesData.toSpliced(
          targetRowIndex - 1,
          2,
          this.state.costPricesPatternsCategoriesData[targetRowIndex],
          this.state.costPricesPatternsCategoriesData[targetRowIndex -1],
        )
      },
      this.emitUpdatingEventWithNewestPayload.bind(this)
    );
  }

  private onSwapingWithNextCategoryButtonClicked(targetRowIndex: number): void {
    this.setState(
      {
        costPricesPatternsCategoriesData: this.state.costPricesPatternsCategoriesData.toSpliced(
          targetRowIndex,
          2,
          this.state.costPricesPatternsCategoriesData[targetRowIndex + 1],
          this.state.costPricesPatternsCategoriesData[targetRowIndex],
        )
      },
      this.emitUpdatingEventWithNewestPayload.bind(this)
    );
  }

  private onSelectNewCostPriceCategoryTypeID(targetRowIndex: number, selectedCostPriceCategoryTypeID: string): void {
    this.setState(
      {
        costPricesPatternsCategoriesData: this.state.costPricesPatternsCategoriesData.toSpliced(
          targetRowIndex,
          1,
          {
            ID: this.state.costPricesPatternsCategoriesData[targetRowIndex].ID,
            selectedTypeID: selectedCostPriceCategoryTypeID
          }
        )
      },
      this.emitUpdatingEventWithNewestPayload.bind(this)
    );
  }

  private onRemovingCostPriceCategoryButtonClicked(targetRowIndex: number): void {
    this.setState(
      { costPricesPatternsCategoriesData: this.state.costPricesPatternsCategoriesData.toSpliced(targetRowIndex, 1) },
      this.emitUpdatingEventWithNewestPayload.bind(this)
    );
  }

  private onAddingOfNewCostPriceCategoryButtonClicked(): void {
    this.setState(
      {
        costPricesPatternsCategoriesData: [
          ...this.state.costPricesPatternsCategoriesData,
          { ID: `TEMPORARY_ID-${ window.crypto.randomUUID() }`, selectedTypeID: null  }
        ]
      },
      this.emitUpdatingEventWithNewestPayload.bind(this)
    );
  }


  /* ━━━ Rendering ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public render(): React.ReactNode {
    return (
      <table
        className={
          [
            CSS_Classes.rootElement,
            ...typeof this.props.className === "string" ? [ this.props.className ] : []
          ].join(" ")
        }>

        <caption>{ this.props.title }</caption>

        <thead>
          <tr>
            <th>{ this.getLocalizedString("table.columnTitles.number") }</th>
            <th>{ this.getLocalizedString("table.columnTitles.ordering") }</th>
            <th>{ this.getLocalizedString("table.columnTitles.category") }</th>
            <th>{ this.getLocalizedString("table.columnTitles.otherActions") }</th>
          </tr>
        </thead>

        <tbody>
          { this.state.costPricesPatternsCategoriesData.map(this.renderTableRow.bind(this)) }
        </tbody>

        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td>
              <Button
                size="sm"
                variant="primary"
                disabled={ this.props.disabled || this.props.readonly }
                onClick={ this.onAddingOfNewCostPriceCategoryButtonClicked.bind(this) }
              >
                { this.getLocalizedString("controls.buttons.categoryAdding.label") }
              </Button>
            </td>
          </tr>
        </tfoot>

      </table>
    );
  }

  private renderTableRow(
    costPricePatternCategory: CostPricePatternsCategoriesManager.State.CostPricePatternCategoryData,
    rowIndex: number
  ): React.ReactNode {
    return (
      <tr key={ costPricePatternCategory.ID }>

        <td>{ rowIndex + 1 }</td>

        <td>

           <Button
            size="sm"
            variant="secondary"
            onClick={ (): void => { this.onSwapingWithPreviousCategoryButtonClicked(rowIndex) } }
            disabled={ rowIndex === 0 || this.props.disabled || this.props.readonly }
            accessibilityGuidance={ this.getLocalizedString("controls.buttons.swapWithPreviousCategory.accessibilityGuidance") }
          >
            ▲
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={ (): void => { this.onSwapingWithNextCategoryButtonClicked(rowIndex) } }
            disabled={
              rowIndex === this.state.costPricesPatternsCategoriesData.length - 1 ||
                  this.props.disabled ||
                  this.props.readonly
            }
            accessibilityGuidance={ this.getLocalizedString("controls.buttons.swapWithNextCategory.accessibilityGuidance") }
          >
            ▼
          </Button>

        </td>

        <td>
          <DropDownList
            placeholder={
              this.getLocalizedString(
                `controls.dropDownLists.category.placeholders.${ this.state.noCategoriesTypesAvailable ? "noData" : "normal" }`
              )
            }
            itemsData={ this.props.categoriesDropDownListItemsData }
            value={ costPricePatternCategory.selectedTypeID }
            onValueChange={
              (selectedCostPricePatternCategory: string): void => {
                this.onSelectNewCostPriceCategoryTypeID(rowIndex, selectedCostPricePatternCategory);
              }
            }
            isVerticalOrientation={ true }
            loading={ this.props.isCategoriesDropDownListDataNotReadyYet }
            disabled={ this.state.noCategoriesTypesAvailable || this.props.disabled || this.props.readonly }
          />
        </td>

        <td>
          <Button
            size="sm"
            variant="danger"
            onClick={ (): void => { this.onRemovingCostPriceCategoryButtonClicked(rowIndex) } }
            disabled={ this.props.disabled || this.props.readonly }
          >
            { this.getLocalizedString("controls.buttons.categoryDeleting.label") }
          </Button>
        </td>

      </tr>
    );
  }


  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private getLocalizedString(path: string): string {
    return I18n.t(`costPricePatternsCategoriesManager:${ path }`);
  }

  private static buildNewestPayload(
    costPricesPatternsCategoriesData: ReadonlyArray<CostPricePatternsCategoriesManager.State.CostPricePatternCategoryData>
  ): CostPricePatternsCategoriesManager.UpdatingEventPayload {
    return costPricesPatternsCategoriesData.flatMap(
      (
        costPricePatternCategoryData: CostPricePatternsCategoriesManager.State.CostPricePatternCategoryData
      ): Array<CostPricePatternsCategoriesManager.UpdatingEventPayload.CostPricePatternCategoryData> =>
          costPricePatternCategoryData.selectedTypeID === null ?
              [] :
              [
                {
                  ID: costPricePatternCategoryData.ID,
                  typeID: costPricePatternCategoryData.selectedTypeID
                }
              ]
    );
  }

  private emitUpdatingEventWithNewestPayload(): void {
    this.props.onUpdatingEventHandler(
      CostPricePatternsCategoriesManager.buildNewestPayload(this.state.costPricesPatternsCategoriesData)
    );
  }

}


namespace CostPricePatternsCategoriesManager {

  /* ━━━ Props ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type Props = Readonly<{
    title: string;
    isCategoriesDropDownListDataNotReadyYet: boolean;
    categoriesDropDownListItemsData: ReadonlyArray<DropDownList.ItemData>;
    readonly: boolean;
    disabled: boolean;
    onUpdatingEventHandler: (updatingEventPayload: UpdatingEventPayload) => void;
    className?: string;
  }>;

  export type UpdatingEventPayload = Array<UpdatingEventPayload.CostPricePatternCategoryData>;

  export namespace UpdatingEventPayload {
    export type CostPricePatternCategoryData = Readonly<{
      ID: string;
      typeID: string;
    }>;
  }


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  export type State = Readonly<{
    costPricesPatternsCategoriesData: ReadonlyArray<State.CostPricePatternCategoryData>;
    noCategoriesTypesAvailable: boolean;
  }>;

  export namespace State {
    export type CostPricePatternCategoryData = Readonly<{
      ID: string;
      selectedTypeID: string | null;
    }>;
  }

}


export default CostPricePatternsCategoriesManager;
