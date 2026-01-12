import type { CalcOperation } from '@pxa-re-management/shared';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CostItemSelector from '@/components/molecules/CostItemSelector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BuCostCodeMock, BuCostItemMock } from '@/store/calcRegister';

type Props = {
  label?: string;
  buCostCodes: BuCostCodeMock[];
  buCostItems: BuCostItemMock[];
  value?: CalcOperation | null;
  opeSeq?: number;
  onChange: (partial: Partial<Pick<CalcOperation, 'opeOperator' | 'opeBuCostCd' | 'opeCostType'>>) => void;
};

const OperationEditor = ({ label, buCostCodes, buCostItems, value, opeSeq, onChange }: Props) => {
  const { t } = useTranslation('calcRegister');
  const isFirstOperation = opeSeq === 1;
  const availableOperators = opeSeq === undefined
    ? (['S', '+', '-', '*', '/'] as const)
    : (['+', '-', '*', '/'] as const);
  
  const currentOperator = value?.opeOperator ?? (opeSeq === undefined ? 'S' : '+');
  
  useEffect(() => {
    if (isFirstOperation && value?.opeOperator !== 'S') {
      onChange({ opeOperator: 'S' });
    }
  }, [isFirstOperation, value?.opeOperator, onChange]);

  return (
    <div className="space-y-2">
      <div className="font-medium">{label ?? t('operationEditor.operation')}</div>
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        {!isFirstOperation && (
          <Select 
            value={currentOperator} 
            onValueChange={(v) => {
              onChange({ opeOperator: v as 'S' | '+' | '-' | '*' | '/' });
            }}
          >
            <SelectTrigger className="w-24 min-w-0">
              <SelectValue placeholder={t('placeholders.selectOperator')} />
            </SelectTrigger>
            <SelectContent>
              {availableOperators.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
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
