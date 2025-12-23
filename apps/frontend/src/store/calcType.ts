import type { CalcType } from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { api } from '../utils/api-client';
import { useStickyMessageActions } from './stickyMessage';

const calcTypeAtom = atom<CalcType[]>([]);

export const useCalcTypeActions = () => {
  const setCalcType = useSetAtom(calcTypeAtom);
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();

  const fetchCalcType = useCallback(
    async (businessunitId: string) => {
      try {
        const url = `calc-type?businessunitId=${businessunitId}`;
        const response = await api.get<CalcType[]>(url).json();
        console.log('[store] fetchCalcType:', response);
        setCalcType(response);
      } catch (error) {
        console.error('fetchCalcType error:', error);
        addErrorMessage('計算種類の取得に失敗しました');
      }
    },
    [setCalcType]
  );

  const createCalcType = useCallback(
    async (calcType: {
      calcTypeNameJa: string;
      calcTypeNameEn: string;
      calcTypeNameZh: string;
      defaultFlg?: boolean;
      businessunitId: string;
    }) => {
      try {
        await api.post('calc-type', {
          json: calcType,
        });
        addSuccessMessage('計算種類を作成しました');
        // 作成成功後にデータを再取得
        await fetchCalcType(calcType.businessunitId);
      } catch (error) {
        console.error('createCalcType error:', error);
        addErrorMessage('計算種類の作成に失敗しました');
        throw error;
      }
    },
    [fetchCalcType]
  );

  const updateCalcType = useCallback(
    async (
      calcTypeId: string,
      updateData: {
        businessunitId: string;
        calcTypeNameJa?: string;
        calcTypeNameEn?: string;
        calcTypeNameZh?: string;
        defaultFlg?: boolean;
      }
    ) => {
      try {
        await api.put(`calc-type/${calcTypeId}`, {
          json: updateData,
        });
        addSuccessMessage('計算種類を更新しました');
        // 更新成功後にデータを再取得
        await fetchCalcType(updateData.businessunitId);
      } catch (error) {
        console.error('updateCalcType error:', error);
        addErrorMessage('計算種類の更新に失敗しました');
        throw error;
      }
    },
    [fetchCalcType]
  );

  const deleteCalcType = useCallback(
    async (calcTypeId: string, businessunitId: string) => {
      try {
        await api.delete(`calc-type/${calcTypeId}`);
        addSuccessMessage('計算種類を削除しました');
        // 削除成功後にデータを再取得
        await fetchCalcType(businessunitId);
      } catch (error) {
        console.error('deleteCalcType error:', error);
        addErrorMessage('計算種類の削除に失敗しました');
        throw error;
      }
    },
    [fetchCalcType]
  );

  const reactivateCalcType = useCallback(
    async (calcTypeId: string, businessunitId: string) => {
      try {
        await api.put(`calc-type/${calcTypeId}/reactivate`);
        addSuccessMessage('計算種類を有効化しました');
        // 有効化成功後にデータを再取得
        await fetchCalcType(businessunitId);
      } catch (error) {
        console.error('reactivateCalcType error:', error);
        addErrorMessage('計算種類の有効化に失敗しました');
        throw error;
      }
    },
    [fetchCalcType]
  );

  const clearCalcType = useCallback(() => {
    console.log('[store] clearCalcType');
    setCalcType([]);
  }, [setCalcType]);

  return {
    fetchCalcType,
    createCalcType,
    updateCalcType,
    deleteCalcType,
    reactivateCalcType,
    clearCalcType,
  };
};

export const useCalcTypeSelectors = () => {
  const calcTypes = useAtomValue(calcTypeAtom);

  return {
    calcTypes,
  };
};
