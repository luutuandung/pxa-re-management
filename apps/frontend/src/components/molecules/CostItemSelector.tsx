import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchableSelect } from '@/components/ui/search-select';
import type { BuCostCodeMock, BuCostItemMock } from '@/store/calcRegister';

type Props = {
  buCostCodes: BuCostCodeMock[];
  buCostItems: BuCostItemMock[];
  value?: { buCostCd: string; costType: 'G' | 'R' | 'K' };
  onChange: (v: { buCostCd: string; costType: 'G' | 'R' | 'K' }) => void;
  label?: string;
};

const CostItemSelector = ({ buCostCodes, buCostItems, value, onChange, label }: Props) => {
  const current = buCostCodes.find((b) => b.buCostCd === value?.buCostCd) ?? buCostCodes[0];
  const currentTypes = buCostItems.filter((i) => i.buCostCodeId === current?.buCostCodeId).map((i) => i.costType);
  const types = currentTypes.length > 0 ? currentTypes : (['G'] as Array<'G' | 'R' | 'K'>);

  const costCdOptions = buCostCodes.map((b) => {
    return { value: b.buCostCd, label: `[${b.buCostCd}] ${b.buCostNameJa}` }
  });
  
  const selectedCostCdOption = costCdOptions.find((o) => o.value === (value?.buCostCd ?? current?.buCostCd)) ?? null;


  return (
    <div className="flex items-center gap-2 min-w-0">
      {label ? <div className="text-sm text-gray-700 whitespace-nowrap">{label}</div> : null}
      <SearchableSelect
        options={costCdOptions}
        value={selectedCostCdOption}
        onChange={(v) => onChange({ buCostCd: v?.value ?? current?.buCostCd, costType: (types?.[0] ?? 'G') as 'G' | 'R' | 'K' })}
        placeholder="原価項目"
      />
      <Select
        value={value?.costType ?? (types?.[0] as 'G' | 'R' | 'K')}
        onValueChange={(v) => onChange({ buCostCd: current?.buCostCd, costType: v as 'G' | 'R' | 'K' })}
      >
        <SelectTrigger className="w-24 min-w-0">
          <SelectValue placeholder="種別" />
        </SelectTrigger>
        <SelectContent>
          {types.map((t) => {
            const label = t === 'G' ? '額' : t === 'R' ? 'レート' : '計算式';
            return (
              <SelectItem key={t} value={t}>
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
