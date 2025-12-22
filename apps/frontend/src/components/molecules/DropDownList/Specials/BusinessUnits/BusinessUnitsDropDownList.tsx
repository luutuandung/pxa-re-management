import type { BusinessUnit } from "@pxa-re-management/shared";
import DropDownList from "@/components/molecules/DropDownList/DropDownList.tsx";
import { useLanguage } from "@/store/languageSettings.ts";
import { useTranslation } from "react-i18next";


const BusinessUnitsDropDownList: React.FC<BusinessUnitsDropDownList.Props> = (
  {
    placeholder,
    loadingInProgressAccessibilityGuidance,
    businessUnits,
    selectedBusinessUnitID,
    onBusinessUnitSelected,
    ...restProps
  }: BusinessUnitsDropDownList.Props
): React.ReactNode => {

  const { currentLanguage } = useLanguage();
  const { t: translate } = useTranslation("businessUnitsDropDownList");

  return (
    <DropDownList
      placeholder={ placeholder ?? translate("defaultPlaceholder") }
      loadingInProgressAccessibilityGuidance={
        loadingInProgressAccessibilityGuidance ?? translate("loadingInProgressAccessibilityGuidance")
      }
      itemsData={
       businessUnits.map(
         (businessUnit: BusinessUnit): DropDownList.ItemData =>
             ({
               key: businessUnit.businessunitId,
               value: businessUnit.businessunitId,
               displayingNode: generateDisplayingNode(businessUnit, currentLanguage)
             })
       )
      }
      value={ selectedBusinessUnitID }
      onValueChange={ onBusinessUnitSelected }
      { ...restProps }
    />
  );

}


namespace BusinessUnitsDropDownList {

  export type Props =
      Omit<
        DropDownList.Props,
            "itemsData" |
            "value" |
            "onValueChange"
      > &
      Readonly<{
        businessUnits: ReadonlyArray<BusinessUnit>;
        selectedBusinessUnitID: string | null;
        onBusinessUnitSelected: (newBusinessUnitID: string) => void;
      }>;

}


export default BusinessUnitsDropDownList;


/* 【 仕様書確認必要 】 旧「LocationSelectField」から引き続き。仕様を確認した上でリファクタリングが必要。 */
function generateDisplayingNode(businessUnit: BusinessUnit, currentLanguage: string): string {

  const joinSpace = (a?: string, b?: string) => [a, b].filter((x) => Boolean(x && x.trim())).join(' ');

  /* 【 方法論 】 優先度高い順に存在するフィールドを採用 */
  const buJa: string = businessUnit.businessunitNameJa ?? businessUnit.name ?? '';
  const buEn: string = businessUnit.businessunitNameEn ?? buJa;
  const prodJa: string = businessUnit.productNameJa ?? '';
  const prodEn: string = businessUnit.productNameEn ?? '';
  const prodZh: string = businessUnit.productNameZh ?? '';

   switch (currentLanguage) {
      case 'ja':
        return joinSpace(buJa, prodJa);
      case 'en':
        return joinSpace(buEn, prodEn);
        /* 【 方法論 】 中国語未実装: 日本語/英語のいずれかにフォールバック */
      default:
        return joinSpace(buJa || buEn, prodJa || prodEn || prodZh);
  }

}
