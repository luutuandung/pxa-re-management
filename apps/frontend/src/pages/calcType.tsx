import type { CalcType } from '@pxa-re-management/shared';
import {
  CommonChineseNamingValidator,
  CommonEnglishNamingValidator,
  CommonJapaneseNamingValidator,
} from '@pxa-re-management/shared';
import { type FC, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import ButtonAtom from '@/components/atoms/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { useCalcRegisterActions } from '@/store/calcRegister';
import { useBusinessUnitActions, useBusinessUnitSelectors } from '../store/businessUnit';
import { useCalcTypeActions, useCalcTypeSelectors } from '../store/calcType';
import { useStickyMessageActions } from '../store/stickyMessage';
import LocationSelectField from "@/components/atoms/LocationSelectField.tsx";

// 統合データ型（既存・新規共通）
interface UnifiedCalcType {
  calcTypeId: string; // 既存: calcTypeId, 新規: 一意ID
  calcTypeNameJa: string;
  calcTypeNameEn: string;
  calcTypeNameZh: string;
  defaultFlg: boolean;
  deleteFlg?: boolean; // 削除フラグ（既存項目のみ）
  createdBy: string;
  createdOn: Date;
  modifiedBy: string;
  modifiedOn: Date;
  businessunitId: string;
  isNew: boolean; // 新規項目フラグ
  isChanged: boolean; // 変更フラグ
}

type ValidationErrorForItem = {
  itemIndex: number;
  itemName: string;
  messages: string[];
};

const convertErrorCodeToTranslationKey = (errorCode: string): string => {
  return errorCode
    .split(/[-_]/)
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
};

const validateField = (
  value: unknown,
  validator: typeof CommonJapaneseNamingValidator | typeof CommonEnglishNamingValidator | typeof CommonChineseNamingValidator,
  fieldPrefix: 'nameJa' | 'nameEn' | 'nameZh',
  t: (key: string, params?: Record<string, string>) => string
): string | null => {
  const validation = validator.validate(value);
  if (validation.isInvalid) {
    const { code, ...parameters } = validation.validationErrorData;
    convertErrorCodeToTranslationKey(code);
    const translationKey = code.includes('INVALID_CHARACTERS')
      ? `${fieldPrefix}InvalidCharacters`
      : `${fieldPrefix}Required`;
    const params: Record<string, string> = {};
    if ('commaSeparatedFoundInvalidCharacters' in parameters) {
      params.characters = parameters.commaSeparatedFoundInvalidCharacters;
    }
    return t(`validation.${translationKey}`, params);
  }
  return null;
};

const CalcTypePage: FC = () => {
  const { t } = useTranslation('calcType');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingSelectedItem, setIsDeletingSelectedItem] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<UnifiedCalcType | null>(null);
  const [selectedBusinessUnitId, _setSelectedBusinessUnitId] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  // 統合データ管理（既存・新規データを統一）
  const [unifiedItems, setUnifiedItems] = useState<UnifiedCalcType[]>([]);
  const [originalItems, setOriginalItems] = useState<UnifiedCalcType[]>([]);

  const { fetchCalcType, createCalcType, updateCalcType, deleteCalcType, reactivateCalcType } = useCalcTypeActions();
  const { calcTypes } = useCalcTypeSelectors();

  const { fetchBusinessUnit } = useBusinessUnitActions();
  const { businessUnits } = useBusinessUnitSelectors();

  const { addErrorMessage } = useStickyMessageActions();

  // const { initForBusinessUnit } = useCalcRegisterActions();

  // 統合データ変換ユーティリティ
  const _convertToUnifiedItem = (item: CalcType): UnifiedCalcType => ({
    calcTypeId: item.calcTypeId,
    calcTypeNameJa: item.calcTypeNameJa,
    calcTypeNameEn: item.calcTypeNameEn,
    calcTypeNameZh: item.calcTypeNameZh,
    defaultFlg: item.defaultFlg,
    isNew: false,
    isChanged: false,
    deleteFlg: item.deleteFlg,
    createdBy: item.createdBy,
    createdOn: item.createdOn,
    modifiedBy: item.modifiedBy,
    modifiedOn: item.modifiedOn,
    businessunitId: item.businessunitId,
  });

  const createNewUnifiedItem = (): UnifiedCalcType => ({
    calcTypeId: `new-${Date.now()}-${Math.random()}`,
    calcTypeNameJa: '',
    calcTypeNameEn: '',
    calcTypeNameZh: '',
    defaultFlg: false,
    isNew: true,
    isChanged: false,
    businessunitId: selectedBusinessUnitId,
    deleteFlg: false,
    createdBy: '',
    createdOn: new Date(),
    modifiedBy: '',
    modifiedOn: new Date(),
  });

  // 既存データの統合データ変換・初期化
  useEffect(() => {
    if (calcTypes.length > 0) {
      const converted = calcTypes.map(_convertToUnifiedItem);
      setUnifiedItems(converted);
      setOriginalItems(JSON.parse(JSON.stringify(converted))); // Deep copy
    } else {
      setUnifiedItems([]);
      setOriginalItems([]);
    }
  }, [calcTypes]);

  // 初期化
  useEffect(() => {
    fetchBusinessUnit();
  }, [fetchBusinessUnit]);

  useEffect(() => {
    console.log('[page] selectedBusinessUnitId:', selectedBusinessUnitId);
    if (selectedBusinessUnitId) {
      fetchCalcType(selectedBusinessUnitId);
    }
  }, [selectedBusinessUnitId, fetchCalcType]);

  // 拠点変更時の処理
  const handleChangeBusinessUnit = (buId: string) => {
    console.log('[page] change BU:', buId);
    // initForBusinessUnit(buId);
    _setSelectedBusinessUnitId(buId);
  };

  // 項目の追加
  const addNewItem = () => {
    if (!selectedBusinessUnitId) {
      addErrorMessage(t('validation.selectBusinessUnit'));
      return;
    }
    const newItem = createNewUnifiedItem();
    setUnifiedItems((prev) => [...prev, newItem]);
  };

  // 項目の削除
  const removeItem = (id: string) => {
    const item = unifiedItems.find((item) => item.calcTypeId === id);
    if (item) {
      setSelectedDeleteItem(item);
      setShowDeleteModal(true);
    }
  };

  // 項目の更新
  const updateItem = (id: string, field: keyof UnifiedCalcType, value: any) => {
    setUnifiedItems((prev) =>
      prev.map((item) => {
        if (item.calcTypeId !== id) return item;

        const updatedItem = { ...item, [field]: value };

        // 変更フラグの設定
        const originalItem = originalItems.find((orig) => orig.calcTypeId === id);
        if (originalItem && !item.isNew) {
          // 既存項目の場合：元の値と比較して変更があるかチェック
          updatedItem.isChanged =
            originalItem.calcTypeNameJa !== updatedItem.calcTypeNameJa ||
            originalItem.calcTypeNameEn !== updatedItem.calcTypeNameEn ||
            originalItem.calcTypeNameZh !== updatedItem.calcTypeNameZh ||
            originalItem.defaultFlg !== updatedItem.defaultFlg;
        } else if (item.isNew) {
          updatedItem.isChanged = true;
        }

        return updatedItem;
      })
    );
  };

  // デフォルト選択の変更
  const updateDefaultSelection = (id: string) => {
    setUnifiedItems((prev) =>
      prev.map((item) => ({
        ...item,
        defaultFlg: item.calcTypeId === id,
        isChanged: item.isChanged || item.defaultFlg !== (item.calcTypeId === id),
      }))
    );
  };

  /**
   * 全アイテムのバリデーション関数
   * @param allItemsToValidate - バリデーション対象の全アイテム（新規項目と変更された既存項目を含む）
   * @param newItemsOnly - 新規項目のみの配列（新規項目のエラーメッセージでインデックスを計算するために使用）
   * @returns バリデーションエラーの配列
   */
  const validateAllItems = (allItemsToValidate: UnifiedCalcType[], newItemsOnly: UnifiedCalcType[]): ValidationErrorForItem[] => {
    const validationErrors: ValidationErrorForItem[] = [];

    for (const [itemIndex, item] of allItemsToValidate.entries()) {
      const messages: string[] = [];

      // 日本語名のバリデーション
      const jaError = validateField(item.calcTypeNameJa, CommonJapaneseNamingValidator, 'nameJa', t);
      if (jaError) messages.push(jaError);

      // 英語名のバリデーション
      const enError = validateField(item.calcTypeNameEn, CommonEnglishNamingValidator, 'nameEn', t);
      if (enError) messages.push(enError);

      // 中国語名のバリデーション
      const zhError = validateField(item.calcTypeNameZh, CommonChineseNamingValidator, 'nameZh', t);
      if (zhError) messages.push(zhError);

      if (messages.length > 0) {
        let itemName: string;
        if (item.isNew) {
          // 新規項目の場合：新規項目配列内でのインデックスを使用
          const newItemIndex = newItemsOnly.findIndex((newItem) => newItem.calcTypeId === item.calcTypeId);
          itemName = t('validation.newItemLabel', { number: newItemIndex + 1 });
        } else {
          // 既存項目の場合：元の日本語名を使用（空文字の場合はフォールバック）
          itemName = item.calcTypeNameJa.trim() || `Item ${itemIndex + 1}`;
        }
        validationErrors.push({
          itemIndex,
          itemName,
          messages,
        });
      }
    }

    return validationErrors;
  };

  // 保存処理
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newItems = unifiedItems.filter((item) => item.isNew);
      const updatedItems = unifiedItems.filter((item) => !item.isNew && item.isChanged);
      const allItemsToValidate = [...newItems, ...updatedItems];

      // バリデーション: 全アイテムを一度に検証
      const validationErrors = validateAllItems(allItemsToValidate, newItems);

      if (validationErrors.length > 0) {
        // すべてのエラーメッセージを表示
        validationErrors.forEach(({ itemName, messages }) => {
          messages.forEach((message) => {
            addErrorMessage(`${itemName}: ${message}`);
          });
        });
        setIsSaving(false);
        setShowSaveModal(false);
        return;
      }

      // 新規項目の個別作成
      for (const item of newItems) {
        console.log('[page] createCalcType:', item);
        await createCalcType({
          calcTypeNameJa: item.calcTypeNameJa,
          calcTypeNameEn: item.calcTypeNameEn,
          calcTypeNameZh: item.calcTypeNameZh,
          defaultFlg: item.defaultFlg,
          businessunitId: item.businessunitId,
        });
      }

      // 既存項目の更新
      for (const item of updatedItems) {
        const updateData: any = {};
        if (item.calcTypeNameJa !== originalItems.find((o) => o.calcTypeId === item.calcTypeId)?.calcTypeNameJa) {
          updateData.calcTypeNameJa = item.calcTypeNameJa;
        }
        if (item.calcTypeNameEn !== originalItems.find((o) => o.calcTypeId === item.calcTypeId)?.calcTypeNameEn) {
          updateData.calcTypeNameEn = item.calcTypeNameEn;
        }
        if (item.calcTypeNameZh !== originalItems.find((o) => o.calcTypeId === item.calcTypeId)?.calcTypeNameZh) {
          updateData.calcTypeNameZh = item.calcTypeNameZh;
        }
        if (item.defaultFlg !== originalItems.find((o) => o.calcTypeId === item.calcTypeId)?.defaultFlg) {
          updateData.defaultFlg = item.defaultFlg;
        }
        if (Object.keys(updateData).length > 0) {
          updateData.businessunitId = item.businessunitId;
          await updateCalcType(item.calcTypeId, updateData);
        }
      }

      setShowSaveModal(false);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 削除処理
  const handleDelete = async () => {
    if (!selectedDeleteItem || isDeletingSelectedItem) return;

    setIsDeletingSelectedItem(true);
    try {
      await deleteCalcType(selectedDeleteItem.calcTypeId, selectedDeleteItem.businessunitId);
      setShowDeleteModal(false);
      setSelectedDeleteItem(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeletingSelectedItem(false);
    }
  };

  // キャンセル処理
  const handleCancel = () => {
    setUnifiedItems(JSON.parse(JSON.stringify(originalItems))); // 元の状態に戻す
    setShowSaveModal(false);
  };

  // 変更があるかチェック
  const hasChanges = unifiedItems.some((item) => item.isChanged || item.isNew);

  // 表示用データ（並び替え）
  const filteredData = useMemo(() => {
    const visible = unifiedItems;
    if (!sortDirection) return visible;
    return [...visible].sort((a, b) => {
      const aDate = a.modifiedOn ? new Date(a.modifiedOn) : new Date(0);
      const bDate = b.modifiedOn ? new Date(b.modifiedOn) : new Date(0);
      return sortDirection === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    });
  }, [unifiedItems, sortDirection]); 

  const toggleSort = () => {
    if (sortDirection === null) setSortDirection('desc');
    else if (sortDirection === 'desc') setSortDirection('asc');
    else setSortDirection(null);
  };

  const getItemsToSave = () => {
    const newItems = unifiedItems.filter((item) => item.isNew && (item.calcTypeNameJa?.trim() || '').length > 0);
    const updates = unifiedItems.filter((item) => !item.isNew && item.isChanged);
    return { newItems, updates };
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="px-6">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <div className="h-0.5 bg-blue-600 w-full"></div>
          </div>

          {/* 条件/操作エリア */}
          <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">{t('controls.selectBusinessUnit')}</span>
                  <LocationSelectField
                    value={selectedBusinessUnitId}
                    onValueChange={handleChangeBusinessUnit}
                    locations={businessUnits}
                    className="w-[240px]"
                  />
                </div>
              </div>

              <Button
                onClick={addNewItem}
                className={selectedBusinessUnitId ? 'bg-[#00388E] hover:bg-[#002a6e] text-white' : ''}
                disabled={!selectedBusinessUnitId}
              >
                {t('controls.add')}
              </Button>
            </div>

            {/* テーブル */}
            <div className="mb-6 border border-gray-200 rounded-lg bg-white">
              <Table>
                <TableHeader className="bg-[#00388E] text-white">
                  <TableRow>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                      {t('table.headers.selection')}
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                      {t('table.headers.name')}
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                      {t('table.headers.nameEn')}
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                      {t('table.headers.nameZh')}
                    </TableHead>
                    <TableHead className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium">
                      <button type="button" onClick={toggleSort} className="flex items-center space-x-1 hover:text-gray-200">
                        <span>{t('table.headers.modifiedDate')}</span>
                        {sortDirection === 'asc' && <span>↑</span>}
                        {sortDirection === 'desc' && <span>↓</span>}
                        {sortDirection === null && <span className="text-white/70">↑↓</span>}
                      </button>
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-sm font-medium">{t('table.headers.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow
                      key={item.calcTypeId}
                      className={item.deleteFlg ? 'bg-gray-100' : item.isNew ? 'bg-green-50' : ''}
                    >
                      {/* デフォルト選択 */}
                      <TableCell className="border-r border-gray-200 px-4 py-3">
                        <input
                          type="radio"
                          name="defaultSelection"
                          checked={item.defaultFlg}
                          onChange={() => updateDefaultSelection(item.calcTypeId)}
                          className="mr-2"
                          disabled={item.deleteFlg}
                        />
                      </TableCell>

                      {/* 名称（日本語） */}
                      <TableCell className="border-r border-gray-200 px-4 py-3">
                        <Input
                          value={item.calcTypeNameJa}
                          onChange={(e) => updateItem(item.calcTypeId, 'calcTypeNameJa', e.target.value)}
                          placeholder={t('controls.placeholderName')}
                          className="w-full"
                          disabled={item.deleteFlg}
                        />
                      </TableCell>

                      {/* 名称（英語） */}
                      <TableCell className="border-r border-gray-200 px-4 py-3">
                        <Input
                          value={item.calcTypeNameEn}
                          onChange={(e) => updateItem(item.calcTypeId, 'calcTypeNameEn', e.target.value)}
                          placeholder={t('controls.placeholderName')}
                          className="w-full"
                          disabled={item.deleteFlg}
                        />
                      </TableCell>

                      {/* 名称（中国語） */}
                      <TableCell className="border-r border-gray-200 px-4 py-3">
                        <Input
                          value={item.calcTypeNameZh}
                          onChange={(e) => updateItem(item.calcTypeId, 'calcTypeNameZh', e.target.value)}
                          placeholder={t('controls.placeholderName')}
                          className="w-full"
                          disabled={item.deleteFlg}
                        />
                      </TableCell>

                      {/* 更新日時/新規行は削除ボタン */}
                      <TableCell className={item.isNew ? 'px-4 py-3 text-center' : 'border-r border-gray-200 px-4 py-3'}>
                        {item.isNew ? (
                          <button
                            type="button"
                            onClick={() => removeItem(item.calcTypeId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-sm text-gray-800">
                            {item.modifiedOn ? dayjs(item.modifiedOn).format('YYYY/MM/DD HH:mm') : '-'}
                          </span>
                        )}
                      </TableCell>

                      {/* 操作 */}
                      <TableCell className="px-4 py-3 text-center">
                        {!item.isNew && (
                          item.deleteFlg ? (
                            <button
                              type="button"
                              onClick={() => reactivateCalcType(item.calcTypeId, item.businessunitId)}
                              className="text-blue-600 hover:text-blue-800 underline hover:no-underline text-sm"
                            >
                              {t('controls.activate')}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDeleteItem(item);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* 操作ボタン */}
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowSaveModal(true)} disabled={!hasChanges} className="bg-[#00388E] hover:bg-[#002a6e] text-white px-8 py-2 disabled:opacity-50">
                {isSaving ? t('controls.saving') : t('controls.save')}
              </Button>
              <Button onClick={handleCancel} variant="outline" className="border-[#00388E] text-[#00388E] hover:bg-gray-100 px-8 py-2" disabled={!hasChanges}>
                {t('controls.cancel')}
              </Button>
            </div>
          </div>
        </div>

        {/* 保存確認モーダル */}
        <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>{t('modals.save.title')}</DialogTitle>
              <DialogDescription>
                {(() => {
                  const items = getItemsToSave();
                  const newCount = items.newItems.length;
                  const updateCount = items.updates.length;
                  if (newCount > 0 && updateCount > 0) return t('modals.save.messageBoth', { newCount, updateCount });
                  if (newCount > 0) return t('modals.save.messageNew', { count: newCount });
                  return t('modals.save.messageUpdate', { count: updateCount });
                })()}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleSave} disabled={isSaving} className="bg-[#00388E] hover:bg-[#002a6e] text-white">
                {isSaving ? t('controls.saving') : t('modals.save.confirm')}
              </Button>
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                {t('modals.save.cancel')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 削除確認モーダル */}
        <Dialog
          open={showDeleteModal}
          onOpenChange={(open) => {
            setShowDeleteModal(open);
            if (!open) setSelectedDeleteItem(null);
          }}
        >
          <DialogContent showCloseButton={false} className="bg-white">
            <DialogHeader>
              <DialogTitle>{t('modals.delete.title')}</DialogTitle>
              <DialogDescription>{t('modals.delete.message')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <ButtonAtom
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDeleteItem(null);
                }}
                variant="secondary"
                disabled={isDeletingSelectedItem}
              >
                {t('modals.delete.cancel')}
              </ButtonAtom>
              <ButtonAtom
                type="button"
                onClick={handleDelete}
                variant="danger"
                disabled={isDeletingSelectedItem}
              >
                {isDeletingSelectedItem ? t('controls.saving') : t('modals.delete.confirm')}
              </ButtonAtom>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CalcTypePage;
