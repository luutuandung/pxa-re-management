import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select.tsx";
import CSS_Classes from "./DropDownList.module.sass";
import React from "react";
import { useTranslation } from "react-i18next";


const DropDownList: React.FC<DropDownList.Props> = (
  {
    label,
    accessibilityGuidance,
    placeholder,
    loadingInProgressAccessibilityGuidance,
    itemsData,
    value,
    onValueChange,
    isVerticalOrientation,
    disabled = false,
    loading,
    className,
  }: DropDownList.Props
): React.ReactNode => {

  const { t: translate } = useTranslation("dropDownList");
  let labelHTML_ID: string | undefined;

  /* 【 方法論 】 生成されたIDがインスタンスによって変わらないと確認済み。 */
  if (typeof label === "string") {
    labelHTML_ID = React.useId();
  }

  /* 【 方法論 】
   * Radix-uiの`Select`の`value`の型は`string | undefined`だが、`undefined`より`null`を取り扱った方が安全
   * （https://eslint.org/docs/latest/rules/no-undefined）。
   * `null`の時何も渡さない後文字列を渡すと、「Select is changing from uncontrolled to controlled」警告が発生の、何かの文字列を渡さないといけない。 */
  return (
    <div
      className={
        [
          CSS_Classes.rootElement,
          isVerticalOrientation ?
              CSS_Classes.rootElement__verticalOrientation : CSS_Classes.rootElement__horizontalOrientation,
          ...typeof className === "string" ? [ className ] : []
        ].join(" ")
      }
    >

      {
        typeof label === "string" ?
            (
              <span
                className={ CSS_Classes.label }
                id={ labelHTML_ID }
              >
                { label }
              </span>
            ) :
            null
      }

      {

        loading ?
            <div className={ CSS_Classes.skeletonLoading }>
              <span className="sr-only">
                { loadingInProgressAccessibilityGuidance ?? translate("loadingInProgressAccessibilityGuidance") }
              </span>
            </div> :
            <Select
              value={ value === null ? "" : value }
              onValueChange={ onValueChange }
              disabled={ disabled }
            >

              <SelectTrigger
                aria-labelledby={ labelHTML_ID }
                aria-label={ accessibilityGuidance }
              >
                <SelectValue placeholder={ placeholder ?? translate("defaultPlaceholder") } />
              </SelectTrigger>

              <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                {
                  itemsData.map(
                    (itemData: DropDownList.ItemData): React.ReactNode => (
                      <SelectItem
                        key={ itemData.key }
                        value={ itemData.value }
                        className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-900"
                      >
                        { itemData.displayingNode }
                      </SelectItem>
                    )
                  )
                }
              </SelectContent>
            </Select>
      }

    </div>
  );
};


namespace DropDownList {

  export type Props = Readonly<{
    label?: string;
    accessibilityGuidance?: string;
    placeholder?: string;
    loadingInProgressAccessibilityGuidance?: string;
    itemsData: ReadonlyArray<ItemData>;
    value: string | null;
    onValueChange: (value: string) => void;
    disabled?: boolean;
    loading?: boolean;
    isVerticalOrientation: boolean;
    className?: string;
  }>;

  export type ItemData = Readonly<{
    key: string | number;
    value: string;
    displayingNode: React.ReactNode;
  }>;

}


export default DropDownList;
