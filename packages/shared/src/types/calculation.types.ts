import type { BuCostCode } from './business-cost.types';
import type { BuCostItem } from './business-cost-item.types';

export type OperatorType = 
  | 'S'
  | '+'
  | '-'
  | '*'
  | '/'
  | '('
  | ')';

export type CalcOperation = {
  calcOperationId: string;
  opeOperator: OperatorType;
  opeBuCostCd: string;
  opeCostType: string;
  opeSeq: number;
};

export type CalcCondition = {
  calcConditionId: string;
  leftConBuCostCd: string;
  leftConCostType: string;
  conOperator: string;
  rightConBuCostCd: string;
  rightConCostType: string;
};

export type CalcFormula = {
  calcFormulaId: string;
  calcDisplayId: string;
  calcConditionId: string;
  calcOperationId: string;
  elseCalcOperationId: string;
  nestCalcFormulaId: string;
  elseNestCalcFormulaId: string;
  evalSeq: number;
};

export type CalcDisplay = {
  calcDisplayId: string;
  calcTypeId: string;
  buCostItemId: string;
  calcDisplayCode: string;
  calcDisplayNameJa: string;
  calcDisplayNameEn: string;
  calcDisplayNameZh: string;
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
  businessunitId: string;
};

export type Calculation = {
  calcDisplay: CalcDisplay;
  calcFormulas: CalcFormula[];
  calcConditions: CalcCondition[];
  calcOperations: CalcOperation[];
};

export interface GetCalcDisplayItem {
  buCostCode: BuCostCode;
  buCostItem: BuCostItem & {
    calcDisplay: CalcDisplay | null;
    calcFormulas: CalcFormula[];
    calcConditions: CalcCondition[];
    calcOperations: CalcOperation[];
  };
}

export interface GetCalcDisplayResponse {
  buCostCodes: GetCalcDisplayItem[];
}
