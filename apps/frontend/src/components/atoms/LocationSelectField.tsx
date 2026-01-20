import type { BusinessUnit } from '@pxa-re-management/shared';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/store/languageSettings';


/** @deprecated 代わりにBusinessUnitsDropDownListを利用。 */
const LocationSelectField: React.FC<LocationSelectField.Props> = ({
  value,
  onValueChange,
  locations,
  placeholder,
  className,
  disabled = false,
}: LocationSelectField.Props): React.ReactNode => {

  const { t } = useTranslation('common');
  const { currentLanguage } = useLanguage();
  const defaultPlaceholder = placeholder ?? t('locationSelect.placeholder');
  const _getLocationName = (businessUnit: BusinessUnit) => {
    const l = businessUnit as unknown as Record<string, any>;
    const joinSpace = (a?: string, b?: string) => [a, b].filter((x) => Boolean(x && x.trim())).join(' ');

    // 優先度高い順に存在するフィールドを採用
    const buJa = l.businessunitNameJa ?? l.name ?? '';
    const buEn = l.businessunitNameEn ?? buJa;
    const prodJa = l.productNameJa ?? '';
    const prodEn = l.productNameEn ?? '';
    const prodZh = l.productNameZh ?? '';

    switch (currentLanguage) {
      case 'ja':
        return joinSpace(buJa, prodJa);
      case 'en':
        return joinSpace(buEn, prodEn);
      // 中国語未実装: 日本語/英語のいずれかにフォールバック
      default:
        return joinSpace(buJa || buEn, prodJa || prodEn || prodZh);
    }
  };

  /* 【 方法論 】
   * 〇 value
   * Radix-uiの`Select`の`value`の型は`string | undefined`だが、`undefined`より`null`を取り扱った方が安全
   * （https://eslint.org/docs/latest/rules/no-undefined）。
   * `null`の時何も渡さない後文字列を渡すと、「Select is changing from uncontrolled to controlled」警告が発生の、何かの文字列を渡さないといけない。
   * 〇 className
   * radix-uiの「Select」コンポーネントは「className」プロパティがないので、DOMを複雑にしdivで包まざるえない。 */
  return (
    <div className={ className }>
      <Select
        value={ value === null ? "" : value }
        onValueChange={ onValueChange }
        disabled={ disabled}
      >
        <SelectTrigger className="cursor-pointer">
          <SelectValue placeholder={ defaultPlaceholder } />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
          {
            locations.map((location) => (
              <SelectItem
                key={ location.businessunitId }
                value={ location.businessunitId }
                className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-900"
              >
                { _getLocationName(location) }
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
    </div>
  );
};


namespace LocationSelectField {

  export type Props = Readonly<{
    value: string | null;
    onValueChange: (value: string) => void;
    locations: ReadonlyArray<BusinessUnit>;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
  }>;

}

export default LocationSelectField;
