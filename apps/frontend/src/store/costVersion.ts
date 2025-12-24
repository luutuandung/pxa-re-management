import type { CostPriceVersion } from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { api } from '../utils/api-client';
import { useStickyMessageActions } from './stickyMessage';
import i18n from '../i18n';

const costVersionsAtom = atom<CostPriceVersion[]>([]);

export const useCostVersionActions = () => {
  const setCostVersions = useSetAtom(costVersionsAtom);
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();

  const fetchCostVersions = useCallback(
    async (ktnCd?: string) => {
      try {
        const url = ktnCd ? `costVersion?ktnCd=${ktnCd}` : 'costVersion';
        const response = await api.get<CostPriceVersion[]>(url).json();
        setCostVersions(response);
      } catch (error) {
        console.error('fetchCostVersions error:', error);
        addErrorMessage(i18n.t('messages.fetchError', { ns: 'costVersionRegistration' }));
      }
    },
    [setCostVersions, addErrorMessage]
  );

  const createCostVersion = useCallback(
    async (data: {
      costVersionId: string;
      businessunitId: string;
      costVersionName: string;
      startDate: string;
      endDate: string;
      description: string;
      defaultFlg: boolean;
    }) => {
      try {
        const response = await api
          .post('costVersion', {
            json: data,
          })
          .json();
        addSuccessMessage(i18n.t('messages.createSuccess', { ns: 'costVersionRegistration' }));
        await fetchCostVersions();
        return response;
      } catch (error) {
        console.error('createCostVersion error:', error);
        addErrorMessage(i18n.t('messages.createError', { ns: 'costVersionRegistration' }));
        throw error;
      }
    },
    [fetchCostVersions, addSuccessMessage, addErrorMessage]
  );

  const updateCostVersion = useCallback(
    async (
      costVersionId: string,
      data: {
        ktnCd?: string;
        costVersionName?: string;
        startDate?: string;
        endDate?: string;
        description?: string;
        defaultFlg?: boolean;
      }
    ) => {
      try {
        const response = await api
          .patch(`costVersion/${costVersionId}`, {
            json: data,
          })
          .json();
        addSuccessMessage(i18n.t('messages.updateSuccess', { ns: 'costVersionRegistration' }));
        await fetchCostVersions();
        return response;
      } catch (error) {
        console.error('updateCostVersion error:', error);
        addErrorMessage(i18n.t('messages.updateError', { ns: 'costVersionRegistration' }));
        throw error;
      }
    },
    [fetchCostVersions, addSuccessMessage, addErrorMessage]
  );

  const deleteCostVersion = useCallback(
    async (costVersionId: string) => {
      try {
        await api.delete(`costVersion/${costVersionId}`);
        addSuccessMessage(i18n.t('messages.deleteSuccess', { ns: 'costVersionRegistration' }));
        await fetchCostVersions();
      } catch (error) {
        console.error('deleteCostVersion error:', error);
        addErrorMessage(i18n.t('messages.deleteError', { ns: 'costVersionRegistration' }));
        throw error;
      }
    },
    [fetchCostVersions, addSuccessMessage, addErrorMessage]
  );

  const duplicateCostVersion = useCallback(
    async (data: {
      sourceCostVersionId: string;
      newCostVersionId?: string;
      newCostVersionName: string;
      ktnCd: string;
    }) => {
      try {
        const response = await api
          .post('costVersion/duplicate', {
            json: data,
          })
          .json();
        addSuccessMessage(i18n.t('messages.duplicateSuccess', { ns: 'costVersionRegistration' }));
        await fetchCostVersions();
        return response;
      } catch (error) {
        console.error('duplicateCostVersion error:', error);
        addErrorMessage(i18n.t('messages.duplicateError', { ns: 'costVersionRegistration' }));
        throw error;
      }
    },
    [fetchCostVersions, addSuccessMessage, addErrorMessage]
  );

  const updateDefaultFlag = useCallback(
    async (costVersionId: string, defaultFlg: boolean) => {
      try {
        const response = await api
          .patch(`costVersion/${costVersionId}/default`, {
            json: { defaultFlg },
          })
          .json();
        addSuccessMessage(i18n.t('messages.updateDefaultSuccess', { ns: 'costVersionRegistration' }));
        await fetchCostVersions();
        return response;
      } catch (error) {
        console.error('updateDefaultFlag error:', error);
        addErrorMessage(i18n.t('messages.updateDefaultError', { ns: 'costVersionRegistration' }));
        throw error;
      }
    },
    [fetchCostVersions, addSuccessMessage, addErrorMessage]
  );

  return {
    fetchCostVersions,
    createCostVersion,
    updateCostVersion,
    deleteCostVersion,
    duplicateCostVersion,
    updateDefaultFlag,
  };
};

export const useCostVersionSelectors = () => {
  const costVersions = useAtomValue(costVersionsAtom);

  return { costVersions };
};
