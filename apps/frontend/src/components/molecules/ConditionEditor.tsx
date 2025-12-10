import type { CalcCondition } from '@pxa-re-management/shared';
import CostItemSelector from '@/components/molecules/CostItemSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BuCostCodeMock, BuCostItemMock } from '@/store/calcRegister';

type Props = {
  buCostCodes: BuCostCodeMock[];
  buCostItems: BuCostItemMock[];
  condition?: CalcCondition;
  onChange: (partial: Partial<CalcCondition>) => void;
};

const ConditionEditor = ({ buCostCodes, buCostItems, condition, onChange }: Props) => {
  return (
    <div className="space-y-2">
      {/* <div className="font-medium">条件式</div> */}
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <CostItemSelector
          buCostCodes={buCostCodes}
          buCostItems={buCostItems}
          value={{
            buCostCd: condition?.leftConBuCostCd ?? '',
            costType: (condition?.leftConCostType ?? 'G') as 'G' | 'R' | 'K',
          }}
          onChange={(v) => onChange({ leftConBuCostCd: v.buCostCd, leftConCostType: v.costType })}
        />
        <Select value={condition?.conOperator ?? '>='} onValueChange={(v) => onChange({ conOperator: v })}>
          <SelectTrigger className="w-24 min-w-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=">=">≥</SelectItem>
            <SelectItem value="<=">≤</SelectItem>
            <SelectItem value="==">==</SelectItem>
            <SelectItem value="<>">＜＞</SelectItem>
          </SelectContent>
        </Select>
        <CostItemSelector
          buCostCodes={buCostCodes}
          buCostItems={buCostItems}
          value={{
            buCostCd: condition?.rightConBuCostCd ?? '',
            costType: (condition?.rightConCostType ?? 'G') as 'G' | 'R' | 'K',
          }}
          onChange={(v) => onChange({ rightConBuCostCd: v.buCostCd, rightConCostType: v.costType })}
        />
      </div>
    </div>
  );
};

export default ConditionEditor;
