import type { CalcOperation } from '@pxa-re-management/shared';
import CostItemSelector from '@/components/molecules/CostItemSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BuCostCodeMock, BuCostItemMock } from '@/store/calcRegister';

type Props = {
  label?: string;
  buCostCodes: BuCostCodeMock[];
  buCostItems: BuCostItemMock[];
  value?: CalcOperation | null;
  onChange: (partial: Partial<Pick<CalcOperation, 'opeOperator' | 'opeBuCostCd' | 'opeCostType'>>) => void;
};

const OperationEditor = ({ label, buCostCodes, buCostItems, value, onChange }: Props) => {
  return (
    <div className="space-y-2">
      <div className="font-medium">{label ?? '演算'}</div>
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <Select value={value?.opeOperator ?? 'S'} onValueChange={(v) => onChange({ opeOperator: v as any })}>
          <SelectTrigger className="w-24 min-w-0">
            <SelectValue placeholder="演算子" />
          </SelectTrigger>
          <SelectContent>
            {(['S', '+', '-', '*', '/'] as const).map((op) => (
              <SelectItem key={op} value={op}>
                {op}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <CostItemSelector
          buCostCodes={buCostCodes}
          buCostItems={buCostItems}
          value={{ buCostCd: value?.opeBuCostCd ?? '', costType: (value?.opeCostType ?? 'G') as 'G' | 'R' | 'K' }}
          onChange={(v) => onChange({ opeBuCostCd: v.buCostCd, opeCostType: v.costType })}
        />
      </div>
    </div>
  );
};

export default OperationEditor;
