import type { CostPriceVersion } from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { api } from '../utils/api-client';
import { useStickyMessageActions } from './stickyMessage';

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
        addErrorMessage('原価バージョンの取得に失敗しました');
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
        addSuccessMessage('原価バージョンを作成しました');
        await fetchCostVersions();
        return response;
      } catch (error) {
        console.error('createCostVersion error:', error);
        addErrorMessage('原価バージョンの作成に失敗しました');
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
        addSuccessMessage('原価バージョンを更新しました');
        await fetchCostVersions();
        return response;
      } catch (error) {
        console.error('updateCostVersion error:', error);
        addErrorMessage('原価バージョンの更新に失敗しました');
        throw error;
      }
    },
    [fetchCostVersions, addSuccessMessage, addErrorMessage]
  );

  const deleteCostVersion = useCallback(
    async (costVersionId: string) => {
      try {
        await api.delete(`costVersion/${costVersionId}`);
        addSuccessMessage('原価バージョンを削除しました');
        await fetchCostVersions();
      } catch (error) {
        console.error('deleteCostVersion error:', error);
        addErrorMessage('原価バージョンの削除に失敗しました');
        throw error;
      }
    },
    [fetchCostVersions, addSuccessMessage, addErrorMessage]
  );

  const duplicateCostVersion = useCallback(
    async (data: {
      sourceCostVersionId: string;
      newCostVersionId: string;
      newCostVersionName: string;
      ktnCd: string;
    }) => {
      try {
        const response = await api
          .post('costVersion/duplicate', {
            json: data,
          })
          .json();
        addSuccessMessage('原価バージョンを複製しました');
        await fetchCostVersions();
        return response;
      } catch (error) {
        console.error('duplicateCostVersion error:', error);
        addErrorMessage('原価バージョンの複製に失敗しました');
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
        addSuccessMessage('デフォルトフラグを更新しました');
        await fetchCostVersions();
        return response;
      } catch (error) {
        console.error('updateDefaultFlag error:', error);
        addErrorMessage('デフォルトフラグの更新に失敗しました');
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
