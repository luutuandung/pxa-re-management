import {
  BusinessCostWithCalcDisplay
} from '@pxa-re-management/shared';


export type GetCalcDisplayResponse = Readonly<{
  buCostCodes: Array<BusinessCostWithCalcDisplay>;
}>;
