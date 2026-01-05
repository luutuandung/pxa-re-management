/* ━━━ Imports ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/* ┅┅┅ Assets ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import CSS_Classes from "./Pagination.module.sass";
import {
  ChevronLeft as LeftChevronIcon,
  ChevronRight as RightChevronIcon,
  ChevronsLeft as DoubleLeftChevronIcon,
  ChevronsRight as DoubleRightChevronsIcon
} from "lucide-react"

/* ┅┅┅ GUI Components ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import DropDownList from "@/components/molecules/DropDownList/DropDownList.tsx";
import Button from "@/components/atoms/Button.tsx";

/* ┅┅┅ Framework ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
import * as React from "react";
import * as I18n from "i18next";


class Pagination extends React.Component<Pagination.Props, Pagination.State> {

  /* ━━━ Static Fields ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static readonly AvailableOptionsForItemsCountPerPageDropDownList: Readonly<{
    ten: 10;
    twenty: 20;
    thirty: 30;
    forty: 40;
    fifty: 50;
  }> = {
    ten: 10,
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50
  };

  public static readonly I18N_Namespace: string = "pagination";

  private static readonly dropDownListItems: ReadonlyArray<DropDownList.ItemData> =
    Object.values(Pagination.AvailableOptionsForItemsCountPerPageDropDownList).map(
      (itemsCountPerPaginationPage: number): DropDownList.ItemData =>
          ({
            key: itemsCountPerPaginationPage,
            value: String(itemsCountPerPaginationPage),
            displayingNode: itemsCountPerPaginationPage
          })
  );


  /* ━━━ State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public state: Pagination.State = { totalPagesCount: 0 };


  /* ━━━ Lifecycle Hooks ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public static getDerivedStateFromProps(
    newProps: Pagination.Props
  ): Partial<Pagination.State> {
    return {
      totalPagesCount: Math.ceil(newProps.totalItemsCount / newProps.itemsCountPerPaginationPage)
    };
  }


  /* ━━━ Actions Handling ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private onSelectNewPageNumber(newPageNumber__numerationFrom1: number): void {
    this.props.onChangeEventHandler({
      newPageNumber__numerationFrom1,
      newItemsCountPerPaginationPage: this.props.itemsCountPerPaginationPage
    });
  }
  private onSelectNewItemsCountPerPaginationPage(newItemsCountPerPaginationPage: number): void {
    this.props.onChangeEventHandler({
      newPageNumber__numerationFrom1: this.props.selectedPageNumber__numerationFrom1,
      newItemsCountPerPaginationPage
    });
  }


  /* ━━━ Rendering ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  public render(): React.ReactNode {
    return (
      <nav
        className={
          [
            CSS_Classes.rootElement,
            ...typeof this.props.className === "string" ? [ this.props.className ] : []
          ].join(" ")
        }
      >

         <DropDownList
           label={ this.getLocalizedString("controls.dropDownLists.itemsPerPageCount.label") }
           itemsData={ Pagination.dropDownListItems }
           value={ String(this.props.itemsCountPerPaginationPage) }
           onValueChange={
             (newItemsCountPerPaginationPage: string): void => {
                this.onSelectNewItemsCountPerPaginationPage(Number.parseInt(newItemsCountPerPaginationPage, 10));
             }
           }
           isVerticalOrientation={ false }
        />

        <ul className={ CSS_Classes.buttonsFlow }>
          <li>
            <Button
              accessibilityGuidance={ this.getLocalizedString("controls.buttons.switchingToFirstPage.accessibilityGuidance") }
              onClick={ (): void => { this.onSelectNewPageNumber(1); } }
              disabled={ this.props.selectedPageNumber__numerationFrom1 === 1 }
              size="sm"
              variant="secondary"
            >
              <DoubleLeftChevronIcon />
            </Button>
          </li>
          <li>
            <Button
              accessibilityGuidance={ this.getLocalizedString("controls.buttons.switchingToPreviousPage.accessibilityGuidance") }
              onClick={ (): void => { this.onSelectNewPageNumber(this.props.selectedPageNumber__numerationFrom1 - 1); } }
              disabled={ this.props.selectedPageNumber__numerationFrom1 === 1 }
              size="sm"
              variant="secondary"
            >
              <LeftChevronIcon />
            </Button>
          </li>
          <li>
            <Button
              accessibilityGuidance={ this.getLocalizedString("controls.buttons.switchingToNextPage.accessibilityGuidance") }
              onClick={ (): void => { this.onSelectNewPageNumber(this.props.selectedPageNumber__numerationFrom1 + 1); } }
              disabled={ this.props.selectedPageNumber__numerationFrom1 === this.state.totalPagesCount }
              size="sm"
              variant="secondary"
            >
              <RightChevronIcon />
            </Button>
          </li>
          <li>
            <Button
              accessibilityGuidance={ this.getLocalizedString("controls.buttons.switchingToLastPage.accessibilityGuidance") }
              onClick={ (): void => { this.onSelectNewPageNumber(this.state.totalPagesCount); } }
              disabled={ this.props.selectedPageNumber__numerationFrom1 === this.state.totalPagesCount }
              size="sm"
              variant="secondary"
            >
              <DoubleRightChevronsIcon />
            </Button>
          </li>
        </ul>

        <span>
          {
            this.getLocalizedString(
              "labels.currentPage",
              {
                selectedPageNumber__numerationFrom1: this.props.selectedPageNumber__numerationFrom1,
                totalPagesCount: this.state.totalPagesCount
              }
            )
          }
        </span>

      </nav>
    );
  }

  /* ━━━ Routines ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  private getLocalizedString(pathWithoutNamespace: string, options?: I18n.TOptions): ReturnType<typeof I18n["t"]> {
    return I18n.t(`pagination:${ pathWithoutNamespace }`, options);
  }

}


namespace Pagination {

  export type Props = Readonly<{
    selectedPageNumber__numerationFrom1: number;
    itemsCountPerPaginationPage: number;
    totalItemsCount: number;
    onChangeEventHandler: (changingEventData: ChangingEventData) => unknown;
    className?: string;
  }>;

  export type State = Readonly<{
    totalPagesCount: number;
  }>;

  export type ChangingEventData = Readonly<{
    newPageNumber__numerationFrom1: number;
    newItemsCountPerPaginationPage: number;
  }>;

}


export default Pagination;
