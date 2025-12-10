import type { BusinessUnitItem } from '@pxa-re-management/shared';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/store/languageSettings';
import { useTranslation } from 'react-i18next';

interface LocationSelectProps {
  value: string | null;
  stringifiedEmptyValue?: string;
  onValueChange: (value: string) => void;
  locations: ReadonlyArray<BusinessUnitItem>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
  value,
  stringifiedEmptyValue = 'LOCATION_SELECT-EMPTY_VALUE',
  onValueChange,
  locations,
  placeholder,
  className,
  disabled = false,
}) => {
  const { t } = useTranslation('common');
  const { currentLanguage } = useLanguage();
  const _getLocationName = (bu: BusinessUnitItem) => {
    const l = bu as unknown as Record<string, any>;
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

  if(!placeholder) placeholder = t('locationSelect.placeholder');

  /* 【 方法論 】
   * Radix-uiの`Select`の`value`の型は`string | undefined`だが、`undefined`より`null`を取り扱った方が安全
   * （https://eslint.org/docs/latest/rules/no-undefined）。
   * `null`の時何も渡さない後文字列を渡すと、「Select is changing from uncontrolled to controlled」警告が発生の、何かの文字列を渡さないといけない。 */
  return (
    <Select
      value={ value === null ? stringifiedEmptyValue : value }
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
        {locations.map((location) => (
          <SelectItem
            key={location.businessunitId}
            value={location.businessunitId}
            className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-900"
          >
            {_getLocationName(location)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocationSelect;
