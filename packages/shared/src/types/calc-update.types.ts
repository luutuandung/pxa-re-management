import type { CalcCondition, CalcFormula, CalcOperation } from './calculation.types';

export type UpdateCalcDatasDto = Readonly<{
  calcDisplayId: string;
  calcTypeId?: string;
  buCostItemId?: string;
  calcFormulas: ReadonlyArray<CalcFormula>;
  calcConditions: ReadonlyArray<CalcCondition>;
  calcOperations: ReadonlyArray<CalcOperation>;
}>;
