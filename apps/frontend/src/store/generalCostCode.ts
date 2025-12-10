import type { GeneralCostCode } from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { api } from '../utils/api-client';
import { useStickyMessageActions } from './stickyMessage';

const generalCostCodeAtom = atom<GeneralCostCode[]>([]);

export const useGeneralCostCodeActions = () => {
  const setGeneralCostCode = useSetAtom(generalCostCodeAtom);
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();

  const fetchGeneralCostCode = useCallback(async () => {
    try {
      const response = await api.get<GeneralCostCode[]>('generalCost/costCodes').json();
      // console.log('fetchGeneralCostCode response:', response);
      setGeneralCostCode(response);
    } catch (error) {
      console.error('fetchGeneralCostCode error:', error);
      // エラー時のみ呼び出し（無限ループを防ぐため依存配列から除外）
      addErrorMessage('原価項目コードの取得に失敗しました');
    }
  }, [setGeneralCostCode]);

  const deleteGeneralCostCode = useCallback(
    async (generalCostCodeId: string) => {
      console.log('deleteGeneralCostCode called with:', generalCostCodeId);
      try {
        await api.delete(`generalCost/${generalCostCodeId}`);
        // メッセージ表示関数は無限ループを防ぐため依存配列から除外
        addSuccessMessage('原価項目コードを削除しました');
        // 削除成功後にデータを再取得
        await fetchGeneralCostCode();
      } catch (error) {
        console.error('deleteGeneralCostCode error:', error);
        addErrorMessage('原価項目コードの削除に失敗しました');
        throw error;
      }
    },
    [fetchGeneralCostCode]
  );

  const reactivateGeneralCostCode = useCallback(
    async (generalCostCodeId: string) => {
      console.log('reactivateGeneralCostCode called with:', generalCostCodeId);
      try {
        await api.put(`generalCost/${generalCostCodeId}/reactivate`);
        // メッセージ表示関数は無限ループを防ぐため依存配列から除外
        addSuccessMessage('原価項目コードを有効化しました');
        // 有効化成功後にデータを再取得
        await fetchGeneralCostCode();
      } catch (error) {
        console.error('reactivateGeneralCostCode error:', error);
        addErrorMessage('原価項目コードの有効化に失敗しました');
        throw error;
      }
    },
    [fetchGeneralCostCode]
  );

  const bulkCreateGeneralCostCodes = useCallback(
    async (
      generalCosts: Array<{
        generalCostCd: string;
        generalCostNameJa: string;
        generalCostNameEn: string;
        generalCostNameZh: string;
        deleteFlg?: boolean;
      }>
    ) => {
      try {
        await api.post('generalCost/bulk', {
          json: { generalCosts },
        });
        addSuccessMessage('統一原価項目を一括作成しました');
        // 作成成功後にデータを再取得
        await fetchGeneralCostCode();
      } catch (error) {
        console.error('bulkCreateGeneralCostCodes error:', error);
        addErrorMessage('統一原価項目の一括作成に失敗しました');
        throw error;
      }
    },
    [fetchGeneralCostCode]
  );

  const updateGeneralCostCode = useCallback(
    async (
      generalCostCodeId: string,
      updateData: {
        generalCostNameJa?: string;
        generalCostNameEn?: string;
        generalCostNameZh?: string;
      }
    ) => {
      console.log('updateGeneralCostCode called with:', generalCostCodeId, updateData);
      try {
        await api.put(`generalCost/${generalCostCodeId}`, {
          json: updateData,
        });
        addSuccessMessage('統一原価項目を更新しました');
        // 更新成功後にデータを再取得
        await fetchGeneralCostCode();
      } catch (error) {
        console.error('updateGeneralCostCode error:', error);
        addErrorMessage('統一原価項目の更新に失敗しました');
        throw error;
      }
    },
    [fetchGeneralCostCode]
  );

  return {
    fetchGeneralCostCode,
    deleteGeneralCostCode,
    reactivateGeneralCostCode,
    bulkCreateGeneralCostCodes,
    updateGeneralCostCode,
  };
};

export const useGeneralCostCodeSelectors = () => {
  const generalCostCode = useAtomValue(generalCostCodeAtom);
  return { generalCostCode };
};
