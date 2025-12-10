import { CalcFormula } from './calculation.types';

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
  calcFormulas: CalcFormula[];
};
