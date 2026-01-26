import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/search-select';
import { useLanguage } from '@/store/languageSettings';
import type { BuCostCodeMock, BuCostItemMock } from '@/store/calcRegister';

type Props = {
  buCostCodes: BuCostCodeMock[];
  buCostItems: BuCostItemMock[];
  value?: { buCostCd: string; costType: 'G' | 'R' | 'K' };
  onChange: (v: { buCostCd: string; costType: 'G' | 'R' | 'K' }) => void;
  label?: string;
  excludeZero?: boolean;
};

const CostItemSelector = ({ buCostCodes, buCostItems, value, onChange, label, excludeZero = false }: Props) => {
  const { t } = useTranslation('calcRegister');
  const { currentLanguage } = useLanguage();
  const validBuCostCodes = buCostCodes.filter((code) => {
    return buCostItems.some((item) => item.buCostCodeId === code.buCostCodeId);
  });
  
  const filteredCostCodes = excludeZero 
    ? validBuCostCodes.filter((b) => b.buCostCd !== 'ZERO')
    : validBuCostCodes;
  
  const current = filteredCostCodes.find((b) => b.buCostCd === value?.buCostCd) ?? filteredCostCodes[0];
  const currentTypes = buCostItems.filter((i) => i.buCostCodeId === current?.buCostCodeId).map((i) => i.costType);
  const types = currentTypes.length > 0 ? currentTypes : (['G'] as Array<'G' | 'R' | 'K'>);

  const costCdOptions = filteredCostCodes.map((b) => {
    const costName = 
      currentLanguage === TagsOfSupportedLanguages.english ? b.buCostNameEn :
      currentLanguage === TagsOfSupportedLanguages.chinese ? b.buCostNameZh :
      b.buCostNameJa;
    return { value: b.buCostCd, label: `[${b.buCostCd}] ${costName}` }
  });
  
  const selectedCostCdOption = costCdOptions.find((o) => o.value === (value?.buCostCd ?? current?.buCostCd)) ?? null;


  return (
    <div className="flex items-center gap-2 min-w-0">
      {label ? <div className="text-sm text-gray-700 whitespace-nowrap">{label}</div> : null}
      <SearchableSelect
        options={costCdOptions}
        value={selectedCostCdOption}
        onChange={(v) => onChange({ buCostCd: v?.value ?? current?.buCostCd, costType: (types?.[0] ?? 'G') as 'G' | 'R' | 'K' })}
        placeholder={t('placeholders.costItem')}
      />
      <Select
        value={value?.costType ?? (types?.[0] as 'G' | 'R' | 'K')}
        onValueChange={(v) => onChange({ buCostCd: current?.buCostCd, costType: v as 'G' | 'R' | 'K' })}
      >
        <SelectTrigger className="w-24 min-w-0">
          <SelectValue placeholder={t('placeholders.costType')} />
        </SelectTrigger>
        <SelectContent>
          {types.map((type) => {
            const label = type === 'G' ? t('labels.costTypeAmount') : type === 'R' ? t('labels.costTypeRate') : t('labels.costTypeFormula');
            return (
              <SelectItem key={type} value={type}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CostItemSelector;
