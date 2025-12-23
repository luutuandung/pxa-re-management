import type { CalcType } from '@pxa-re-management/shared';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { api } from '../utils/api-client';
import { useStickyMessageActions } from './stickyMessage';
import i18n from '../i18n';

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
        addErrorMessage(i18n.t('messages.fetchError', { ns: 'calcType' }));
      }
    },
    [setCalcType, addErrorMessage]
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
        addSuccessMessage(i18n.t('messages.saveSuccess', { ns: 'calcType' }));
        // 作成成功後にデータを再取得
        await fetchCalcType(calcType.businessunitId);
      } catch (error) {
        console.error('createCalcType error:', error);
        addErrorMessage(i18n.t('messages.saveError', { ns: 'calcType' }));
        throw error;
      }
    },
    [fetchCalcType, addSuccessMessage, addErrorMessage]
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
        addSuccessMessage(i18n.t('messages.saveSuccess', { ns: 'calcType' }));
        // 更新成功後にデータを再取得
        await fetchCalcType(updateData.businessunitId);
      } catch (error) {
        console.error('updateCalcType error:', error);
        addErrorMessage(i18n.t('messages.saveError', { ns: 'calcType' }));
        throw error;
      }
    },
    [fetchCalcType, addSuccessMessage, addErrorMessage]
  );

  const deleteCalcType = useCallback(
    async (calcTypeId: string, businessunitId: string) => {
      try {
        await api.delete(`calc-type/${calcTypeId}`);
        addSuccessMessage(i18n.t('messages.deleteSuccess', { ns: 'calcType' }));
        // 削除成功後にデータを再取得
        await fetchCalcType(businessunitId);
      } catch (error) {
        console.error('deleteCalcType error:', error);
        addErrorMessage(i18n.t('messages.deleteError', { ns: 'calcType' }));
        throw error;
      }
    },
    [fetchCalcType, addSuccessMessage, addErrorMessage]
  );

  const reactivateCalcType = useCallback(
    async (calcTypeId: string, businessunitId: string) => {
      try {
        await api.put(`calc-type/${calcTypeId}/reactivate`);
        addSuccessMessage(i18n.t('messages.activateSuccess', { ns: 'calcType' }));
        // 有効化成功後にデータを再取得
        await fetchCalcType(businessunitId);
      } catch (error) {
        console.error('reactivateCalcType error:', error);
        addErrorMessage(i18n.t('messages.activateError', { ns: 'calcType' }));
        throw error;
      }
    },
    [fetchCalcType, addSuccessMessage, addErrorMessage]
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
