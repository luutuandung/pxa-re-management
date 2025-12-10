import type { Calculation } from '@pxa-re-management/shared';
import { atom } from 'jotai';
import { api } from '@/utils/api-client';

export const calculationAtom = atom<Calculation[]>([]);

export const useCalculationActions = () => {
  const fetchCalculation = async () => {
    const response = await api.get('/calculations');
    return response;
  };

  return { fetchCalculation };
};
