import type { BusinessUnitItem, GetBusinessUnitListResponse } from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { api } from '@/utils/api-client';
import { useStickyMessageActions } from './stickyMessage';

const businessUnitAtom = atom<BusinessUnitItem[]>([]);

export const useBusinessUnitActions = () => {
  const setBusinessUnit = useSetAtom(businessUnitAtom);
  const { addErrorMessage } = useStickyMessageActions();

  const fetchBusinessUnit = useCallback(async () => {
    try {
      const response = await api.get<GetBusinessUnitListResponse>('business-unit').json();
      setBusinessUnit(response.businessUnits ?? []);
    } catch (error) {
      console.error('fetchBusinessUnit error:', error);
      addErrorMessage('拠点情報の取得に失敗しました');
    }
  }, [setBusinessUnit]);

  return {
    fetchBusinessUnit,
  };
};

export const useBusinessUnitSelectors = () => {
  const businessUnits = useAtomValue(businessUnitAtom);

  return {
    businessUnits,
  };
};
