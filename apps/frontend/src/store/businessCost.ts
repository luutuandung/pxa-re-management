import type { BusinessCostWithNamesForCalculationResponse } from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { api } from '@/utils/api-client';

export const businessCostForCalculationAtom = atom<BusinessCostWithNamesForCalculationResponse[]>([]);

export const useBusinessCostForCalculationSelectors = () => {
  const businessCostForCalculation = useAtomValue(businessCostForCalculationAtom);
  return {
    businessCostForCalculation,
  };
};

export const useBusinessCostActions = () => {
  const setBusinessCostForCalculation = useSetAtom(businessCostForCalculationAtom);
  const fetchBusinessCostForCalculation = async (buCd: string, calcTypeId?: string) => {
    const response = await api
      .get<BusinessCostWithNamesForCalculationResponse[]>('businessCost/calculation', {
        searchParams: {
          buCd: buCd,
          ...(calcTypeId ? { calcTypeId } : {}),
        },
      })
      .json();
    console.log('fetchBusinessCostForCalculation response:', response);
    setBusinessCostForCalculation(response);
    return response;
  };

  return {
    fetchBusinessCostForCalculation,
  };
};
