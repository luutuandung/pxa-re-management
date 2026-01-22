import { type BusinessUnit, BusinessUnitTransactions } from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { api } from '@/utils/api-client';
import { useStickyMessageActions } from './stickyMessage';
import i18n from '../i18n';

const businessUnitAtom = atom<BusinessUnit[]>([]);

export const useBusinessUnitActions = () => {
  const setBusinessUnit = useSetAtom(businessUnitAtom);
  const { addErrorMessage } = useStickyMessageActions();

  const fetchBusinessUnit = useCallback(async (): Promise<void> => {
    try {
      setBusinessUnit(await api.get<Array<BusinessUnit>>(BusinessUnitTransactions.RetrievingOfAll.URI_PATH).json());
    } catch (error) {
      console.error('fetchBusinessUnit error:', error);
      addErrorMessage(i18n.t('messages.businessUnitFetchError', { ns: 'common' }));
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
