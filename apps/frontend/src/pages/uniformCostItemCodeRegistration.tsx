import type { GeneralCostCode } from '@pxa-re-management/shared';
import * as ReactTable from '@tanstack/react-table';
import dayjs from 'dayjs';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { DataTablePagination } from '@/components/molecules/DataTablePagination';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import deleteIcon from '../assets/btn_delete.svg';
import { useGeneralCostCodeActions, useGeneralCostCodeSelectors } from '../store/generalCostCode';
import { useStickyMessageActions } from '../store/stickyMessage';

// 統合データ型（既存・新規共通）
interface UnifiedCostItem {
  id: string; // 既存: generalCostCodeId, 新規: 一意ID
  generalCostCd: string;
  generalCostNameJa: string;
  generalCostNameEn: string;
  generalCostNameZh: string;
  isNew: boolean; // 新規項目フラグ
  isChanged: boolean; // 変更フラグ
  deleteFlg?: boolean; // 削除フラグ（既存項目のみ）
  modifiedOn?: Date; // 更新日時（既存項目のみ）
}


const UniformCostItemCodeRegistration: React.FC = (): React.ReactNode => {

  const { t } = useTranslation('uniformCostItemCodeRegistration');

  const [showInvalidItems, setShowInvalidItems] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = React.useState<UnifiedCostItem | null>(null);
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | null>(null);
  const [highlightedItemID, setHighlightedItemID] = React.useState<string | null>(null);

  // 統合データ管理（既存・新規データを統一）
  const [unifiedItems, setUnifiedItems] = React.useState<UnifiedCostItem[]>([]);
  const [originalItems, setOriginalItems] = React.useState<UnifiedCostItem[]>([]);

  const {
    fetchGeneralCostCode,
    deleteGeneralCostCode,
    reactivateGeneralCostCode,
    bulkCreateGeneralCostCodes,
    updateGeneralCostCode,
  } = useGeneralCostCodeActions();
  const { generalCostCode } = useGeneralCostCodeSelectors();
  const { addErrorMessage } = useStickyMessageActions();

  // 統合データ変換ユーティリティ
  const convertToUnifiedItem = (item: GeneralCostCode): UnifiedCostItem => ({
    id: item.generalCostCodeId,
    generalCostCd: item.generalCostCd,
    generalCostNameJa: item.generalCostNameJa,
    generalCostNameEn: item.generalCostNameEn,
    generalCostNameZh: item.generalCostNameZh,
    isNew: false,
    isChanged: false,
    deleteFlg: item.deleteFlg,
    modifiedOn: item.modifiedOn,
  });

  const createNewUnifiedItem = (): UnifiedCostItem => ({
    id: `new-${Date.now()}-${Math.random()}`,
    generalCostCd: '',
    generalCostNameJa: '',
    generalCostNameEn: '',
    generalCostNameZh: '',
    isNew: true,
    isChanged: false,
  });

  // 表示用データのフィルタリング・ソート
  const filteredData = React.useMemo(
    (): Array<UnifiedCostItem> => unifiedItems

      .filter((item): boolean => !(!showInvalidItems && item.deleteFlg))

      .sort((a, b) => {
        if (sortDirection === null) return 0;

        const aDate = a.modifiedOn ? new Date(a.modifiedOn) : new Date(0);
        const bDate = b.modifiedOn ? new Date(b.modifiedOn) : new Date(0);

        if (sortDirection === 'asc') {
          return aDate.getTime() - bDate.getTime();
        } else {
          return bDate.getTime() - aDate.getTime();
        }

      }),

    [ unifiedItems, showInvalidItems ]
  );

  const [ pagination, setPagination ] = React.useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const [columnFilters, setColumnFilters] = React.useState<ReactTable.ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<ReactTable.SortingState>([]);

  React.useEffect(
    (): void => {
      setPagination((previousPagination): ReactTable.PaginationState => ({ pageIndex: 0, pageSize: previousPagination.pageSize }))
    },
    [ showInvalidItems ]
  );

  React.useEffect(
    (): void => {
      setHighlightedItemID(null);
    },
    [ pagination.pageIndex ]
  );

  // 既存データの統合データ変換・初期化
  React.useEffect(() => {
    if (generalCostCode.length > 0) {
      const converted = generalCostCode.map(convertToUnifiedItem);
      setUnifiedItems(converted);
      setOriginalItems(JSON.parse(JSON.stringify(converted))); // Deep copy
    }
  }, [generalCostCode]);

  // 初期化
  React.useEffect(() => {
    fetchGeneralCostCode();
  }, [fetchGeneralCostCode]);

  /*
   * 【日本語名】 項目を追加
   * 【関連仕様書】https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/12/
   * */
  const addNewItem: () => void = React.useCallback(
    (): void => {

      const newItem: UnifiedCostItem = createNewUnifiedItem();

      /* 【 論理・方法論 】
       * 表の行の指数や行のID指数を使うと、ややこしくなるから、UnifiedCostItemを使った方が良い。
       * ここでunifiedItems配列が使われているが、実際に表示されているのはfilteredData配列なので、指数が一致しているとは限らない。 */
      setUnifiedItems(
        (existingItems: ReadonlyArray<UnifiedCostItem>): Array<UnifiedCostItem> =>
            highlightedItemID === null ?
                [ newItem, ...existingItems ] :
                existingItems.toSpliced(
                  existingItems.findIndex((existingItem: UnifiedCostItem): boolean => existingItem.id === highlightedItemID) + 1,
                  0,
                  newItem
                )
      );

      if (highlightedItemID === null && pagination.pageIndex !== 0) {
        setPagination(
          ({ pageSize }: ReactTable.PaginationState): ReactTable.PaginationState  => ({ pageIndex: 0, pageSize })
        );
      }

    },
    [ createNewUnifiedItem, setUnifiedItems, highlightedItemID, pagination.pageIndex, setPagination ]
  );

  const onClickTableRow: (item: UnifiedCostItem, event: React.MouseEvent) => void = React.useCallback(
    (item: UnifiedCostItem, event: React.MouseEvent): void => {
      if ((event.target instanceof HTMLElement) && event.target.tagName === "TD") {
        setHighlightedItemID(
          (previousHighlightedItemID): string | null => previousHighlightedItemID === item.id ? null: item.id
        );
      }
    },
    [ setHighlightedItemID ]
  );

  function computeTableRowClassNameAttributeValue(
    { original: unifiedCostItem }: ReactTable.Row<UnifiedCostItem>
  ): string {

    if (unifiedCostItem.id === highlightedItemID) {
      return 'bg-amber-100';
    }


    if (unifiedCostItem.deleteFlg === true) {
      return 'bg-gray-100';
    }


    if (unifiedCostItem.isNew) {
      return 'bg-green-50';
    }


    return '';

  }

  // 項目の削除
  const removeItem = React.useCallback(
    (id: string): void => {
      setUnifiedItems((prev) => prev.filter((item) => item.id !== id));
    },
    []
  );

  // 項目の更新
  const updateItem = React.useCallback(
    (id: string, field: keyof UnifiedCostItem, value: string | boolean): void => {
      setUnifiedItems(
        (prev) =>
            prev.map((item) => {
              if (item.id !== id) return item;

              const updatedItem = { ...item, [field]: value };

              // 変更フラグの設定
              const originalItem = originalItems.find((orig) => orig.id === id);
              if (originalItem && !item.isNew) {
                // 既存項目の場合：元の値と比較して変更があるかチェック
                updatedItem.isChanged =
                  originalItem.generalCostCd !== updatedItem.generalCostCd ||
                  originalItem.generalCostNameJa !== updatedItem.generalCostNameJa ||
                  originalItem.generalCostNameEn !== updatedItem.generalCostNameEn ||
                  originalItem.generalCostNameZh !== updatedItem.generalCostNameZh;
              } else if (item.isNew) {
                // 新規項目の場合：何かしら入力があるかチェック
                updatedItem.isChanged =
                  updatedItem.generalCostCd.trim() !== '' ||
                  updatedItem.generalCostNameJa.trim() !== '' ||
                  updatedItem.generalCostNameEn.trim() !== '' ||
                  updatedItem.generalCostNameZh.trim() !== '';
              }

              return updatedItem;
            })
      );
  },
  [ originalItems ]
);

  // 保存処理
  const handleSave = () => {
    if (isSaving) return;

    // 実際に変更されたアイテムのみを取得
    console.log('統一原価項目 - handleSave開始');
    console.log('unifiedItems:', unifiedItems);

    const changedItems = unifiedItems.filter((item) => {
      if (item.isNew) {
        // 新規項目：何かしら入力があるもの
        const hasInput =
          item.generalCostCd.trim() !== '' ||
          item.generalCostNameJa.trim() !== '' ||
          item.generalCostNameEn.trim() !== '' ||
          item.generalCostNameZh.trim() !== '';
        console.log(`新規項目 ${item.id}:`, { hasInput, item });
        return hasInput;
      } else {
        // 既存項目：元の値から変更があるもの
        const originalItem = originalItems.find((orig) => orig.id === item.id);
        if (!originalItem) return false;

        const hasChanged =
          originalItem.generalCostCd !== item.generalCostCd ||
          originalItem.generalCostNameJa !== item.generalCostNameJa ||
          originalItem.generalCostNameEn !== item.generalCostNameEn ||
          originalItem.generalCostNameZh !== item.generalCostNameZh;
        console.log(`既存項目 ${item.id}:`, { hasChanged, originalItem, currentItem: item });
        return hasChanged;
      }
    });

    console.log('changedItems in handleSave:', changedItems);

    // バリデーション
    const hasEmptyFields = changedItems.some(
      (item) => !item.generalCostCd || !item.generalCostNameJa || !item.generalCostNameEn || !item.generalCostNameZh
    );

    if (hasEmptyFields) {
      addErrorMessage(t('validation.generalCostCd'));
      return;
    }

    // 重複チェック
    const codes = changedItems.map((item) => item.generalCostCd);
    const duplicates = codes.filter((code, index) => codes.indexOf(code) !== index);
    if (duplicates.length > 0) {
      addErrorMessage(`${t('messages.saveError')}: ${duplicates.join(', ')}`);
      return;
    }

    if (changedItems.length === 0) {
      addErrorMessage(t('messages.saveError'));
      return;
    }

    setShowSaveModal(true);
  };

  // 保存確認
  const confirmSave = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      // 実際に変更されたアイテムのみを取得（handleSaveと同じロジック）
      const changedItems = unifiedItems.filter((item) => {
        if (item.isNew) {
          // 新規項目：何かしら入力があるもの
          return (
            item.generalCostCd.trim() !== '' ||
            item.generalCostNameJa.trim() !== '' ||
            item.generalCostNameEn.trim() !== '' ||
            item.generalCostNameZh.trim() !== ''
          );
        } else {
          // 既存項目：元の値から変更があるもの
          const originalItem = originalItems.find((orig) => orig.id === item.id);
          if (!originalItem) return false;

          return (
            originalItem.generalCostCd !== item.generalCostCd ||
            originalItem.generalCostNameJa !== item.generalCostNameJa ||
            originalItem.generalCostNameEn !== item.generalCostNameEn ||
            originalItem.generalCostNameZh !== item.generalCostNameZh
          );
        }
      });
      const newItems = changedItems.filter((item) => item.isNew);
      const updatedItems = changedItems.filter((item) => !item.isNew);

      // 新規項目の一括作成
      if (newItems.length > 0) {
        await bulkCreateGeneralCostCodes(
          newItems.map((item) => ({
            generalCostCd: item.generalCostCd,
            generalCostNameJa: item.generalCostNameJa,
            generalCostNameEn: item.generalCostNameEn,
            generalCostNameZh: item.generalCostNameZh,
          }))
        );
      }

      // 既存項目の更新
      if (updatedItems.length > 0) {
        console.log('既存項目の更新を実行:', updatedItems);
        for (const item of updatedItems) {
          await updateGeneralCostCode(item.id, {
            generalCostNameJa: item.generalCostNameJa,
            generalCostNameEn: item.generalCostNameEn,
            generalCostNameZh: item.generalCostNameZh,
          });
        }
      }

      setShowSaveModal(false);
      await fetchGeneralCostCode(); // データ再取得
    } catch (error) {
      console.error('保存に失敗しました:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // 既存データの削除処理
  const handleDeleteExistingItem = React.useCallback(
    (item: UnifiedCostItem) => {
      setSelectedDeleteItem(item);
      setShowDeleteModal(true);
      setHighlightedItemID(null);
    },
    [ setSelectedDeleteItem, setShowDeleteModal, setHighlightedItemID ]
  ) ;

  const confirmDelete = async () => {
    if (!selectedDeleteItem) return;

    try {
      if (selectedDeleteItem.isNew) {
        // 新規項目の場合は単純に削除
        removeItem(selectedDeleteItem.id);
      } else {
        // 既存項目の場合は論理削除
        await deleteGeneralCostCode(selectedDeleteItem.id);
      }
      setShowDeleteModal(false);
      setSelectedDeleteItem(null);
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
  };

  // 有効化処理
  const handleReactivate = React.useCallback(
    async (item: UnifiedCostItem) => {
      try {
        await reactivateGeneralCostCode(item.id);
      } catch (error) {
        console.error('有効化に失敗しました:', error);
      }
    },
    [ reactivateGeneralCostCode ]
  );

  // ソート機能
  const handleSort = () => {
    if (sortDirection === null) {
      setSortDirection('desc');
    } else if (sortDirection === 'desc') {
      setSortDirection('asc');
    } else {
      setSortDirection(null);
    }
  };

  /* ━━━ Rendering ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const columns: Array<ReactTable.ColumnDef<UnifiedCostItem>> = React.useMemo(
    (): Array<ReactTable.ColumnDef<UnifiedCostItem>> => [

      /* コード列（既存は固定、新規は編集可能） */
      {
        accessorKey: 'CODE',
        header: (): React.ReactNode => t('table.headers.code'),
        cell: (
          { row: { original: unifiedCostItem } }: ReactTable.CellContext<UnifiedCostItem, unknown>
        ): React.ReactNode => (
          unifiedCostItem.isNew ?
            (
              <input
                type="text"
                value={ unifiedCostItem.generalCostCd }
                onChange={
                  (event: React.ChangeEvent<HTMLInputElement>) => {
                    updateItem(unifiedCostItem.id, 'generalCostCd', event.target.value);
                  }
                }
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={ t('table.placeholders.inputCode') }
              />
            ) :
            (
              <span className="text-sm text-gray-800">{ unifiedCostItem.generalCostCd }</span>
            )
        )
      },

      /* 日本語名称列（常時編集可能） */
      {
        accessorKey: 'JAPANESE_NAME',
        header: (): React.ReactNode => t('table.headers.japaneseName'),
        cell: (
          { row: { original: unifiedCostItem } }: ReactTable.CellContext<UnifiedCostItem, unknown>
        ): React.ReactNode => (
          <input
            type="text"
            value={ unifiedCostItem.generalCostNameJa }
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>) => {
                updateItem(unifiedCostItem.id, 'generalCostNameJa', event.target.value);
              }
            }
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={ t('table.placeholders.inputJapaneseName') }
            disabled={ unifiedCostItem.deleteFlg }
          />
        )
      },


      /* 英語名称列（常時編集可能） */
      {
        accessorKey: 'ENGLISH_NAME',
        header: (): React.ReactNode => t('table.headers.englishName'),
        cell: (
          { row: { original: unifiedCostItem } }: ReactTable.CellContext<UnifiedCostItem, unknown>
        ): React.ReactNode => (

          <input
            type="text"
            value={ unifiedCostItem.generalCostNameEn }
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>) => {
                updateItem( unifiedCostItem.id, 'generalCostNameEn', event.target.value);
              }
            }
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={ t( 'table.placeholders.inputEnglishName') }
            disabled={ unifiedCostItem.deleteFlg }
          />
        )
      },

      /* 中国語名称列（常時編集可能）*/
      {
        accessorKey: 'CHINESE_NAME',
        header: (): React.ReactNode => t('table.headers.chineseName'),
        cell: (
          { row: { original: unifiedCostItem } }: ReactTable.CellContext<UnifiedCostItem, unknown>
        ): React.ReactNode => (

          <input
            type="text"
            value={ unifiedCostItem.generalCostNameZh }
            onChange={
              (event: React.ChangeEvent<HTMLInputElement>) => {
                updateItem(unifiedCostItem.id, 'generalCostNameZh', event.target.value);
              }
            }
            className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={ t( 'table.placeholders.inputChineseName') }
            disabled={ unifiedCostItem.deleteFlg }
          />
        )
      },

      /* 更新日時列 */
      {
        accessorKey: 'SORTING',
        header: (): React.ReactNode => (
          <button
            type="button"
            onClick={ handleSort }
            className="flex items-center space-x-1 hover:text-gray-900"
          >
            <span>{ t('table.headers.modifiedDate') }</span>
            { sortDirection === 'asc' && <span>↑</span> }
            { sortDirection === 'desc' && <span>↓</span> }
            { sortDirection === null && <span className="text-gray-400">↑↓</span> }
          </button>
        ),
        cell: (
          { row: { original: unifiedCostItem } }: ReactTable.CellContext<UnifiedCostItem, unknown>
        ): React.ReactNode => (
          unifiedCostItem.isNew ?
              (
                <button
                  type="button"
                  onClick={(): void => { removeItem( unifiedCostItem.id) }}
                  className="text-red-600 hover:text-red-800"
                >
                  <img src={deleteIcon} alt={t('table.deleteAlt')} className="w-6 h-6" />
                </button>
              ) :
              (
                <span className="text-sm text-gray-800">
                  {
                    typeof unifiedCostItem.modifiedOn === 'undefined' ?
                        '-' :
                        dayjs(unifiedCostItem.modifiedOn).format('YYYY/MM/DD HH:mm')
                  }
                </span>
              )
        )
      },

      /* アクション */
      {
        accessorKey: 'ACTIONS',
        header: (): React.ReactNode => (<></>),
        cell: (
          { row: { original: unifiedCostItem } }: ReactTable.CellContext<UnifiedCostItem, unknown>
        ): React.ReactNode => (
          unifiedCostItem.isNew ?
              (
                <button
                  type="button"
                  onClick={() => handleReactivate(unifiedCostItem)}
                  className="text-blue-600 hover:text-blue-800 underline hover:no-underline text-sm"
                >
                  {t('controls.activate')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDeleteExistingItem(unifiedCostItem)}
                  className="text-red-600 hover:text-red-800"
                >
                  <img src={ deleteIcon } alt={t('table.deleteAlt')} className="w-4 h-4" />
                </button>
              )
        )
      },

    ],
    [ t, updateItem, removeItem, handleDeleteExistingItem, handleReactivate ]
  );

  const tableModel: ReactTable.Table<UnifiedCostItem> = ReactTable.useReactTable({
    data: filteredData ?? [],
    columns,
    getCoreRowModel: ReactTable.getCoreRowModel(),
    getFilteredRowModel: ReactTable.getFilteredRowModel(),
    getPaginationRowModel: ReactTable.getPaginationRowModel(),
    getSortedRowModel: ReactTable.getSortedRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    autoResetPageIndex: false,
    state: {
      pagination,
      columnFilters,
      sorting,
    },
  });

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 py-8">

        { /* ┉┉┉ ページ見出し ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <div className="h-0.5 bg-blue-600 w-full"></div>
        </div>


        <div className="p-6">

          { /* ┉┉┉ 補助見出し ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
          <h2 className="text-lg font-semibold text-gray-800 mb-6">{t('sections.uniformCostItems')}</h2>

          { /* ┉┉┉ トップアクションバー ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
          <div className="flex justify-between items-center mb-6">

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-700">{t('controls.showInvalid')}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showInvalidItems}
                  onChange={(e) => setShowInvalidItems(e.target.checked)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer-checked:bg-blue-600 transition-colors duration-200 ease-in-out"></div>
                <div className="absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-200 ease-in-out peer-checked:translate-x-5 peer-checked:border-white pointer-events-none"></div>
              </label>
            </div>

            <button
              type="button"
              onClick={addNewItem}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              {t('controls.add')}
            </button>

          </div>

          { /* ┉┉┉ データ表示テーブル ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
          <div className="mb-6 border border-gray-200 rounded-lg bg-white">
            <Table>

              { /* ┅┅┅ ヘッダー ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */ }
              <TableHeader className="bg-[#00388E] text-white">
                {
                  tableModel.getHeaderGroups().map(
                    (headerGroup: ReactTable.HeaderGroup<UnifiedCostItem>): React.ReactNode => (
                      <TableRow key={ headerGroup.id }>
                        {
                          headerGroup.headers.map(
                            (header: ReactTable.Header<UnifiedCostItem, unknown>): React.ReactNode => (
                              <TableHead
                                key={ header.id }
                                className={
                                  [
                                    'px-4',
                                    'py-3',
                                    'text-sm',
                                    'font-medium',
                                    ...header.id === 'ACTIONS' ?
                                        [
                                          'text-center',
                                          'text-gray-700'
                                        ] :
                                        [
                                          'border-r',
                                          'text-left',
                                          'border-gray-200'
                                        ]
                                  ].join(' ')
                                }
                              >
                                <div data-test1={ header.id } data-test2={ header.column.id }></div>
                                {
                                  header.isPlaceholder ?
                                      null :
                                      ReactTable.flexRender(header.column.columnDef.header, header.getContext())
                                }
                              </TableHead>
                            )
                          )
                        }
                      </TableRow>
                    )
                  )
                }
              </TableHeader>

              { /* ┅┅┅ ボディ ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */ }
              <TableBody>

                {
                  tableModel.getRowModel().rows.length > 0 ?
                      tableModel.getRowModel().rows.map(
                        (row): React.ReactNode => (
                          <TableRow
                            key={ row.id }
                            className={ computeTableRowClassNameAttributeValue(row) }
                            onClick={ (event: React.MouseEvent): void => { onClickTableRow(row.original, event); } }
                          >
                            {
                              row.getVisibleCells().map(
                                (cell: ReactTable.Cell<UnifiedCostItem, unknown>) => (
                                  <TableCell
                                    key={ cell.id }
                                    className={
                                      [
                                        'px-4',
                                        'py-3',
                                        ...cell.id === 'ACTIONS' || cell.row.original.isNew ?
                                            [ 'text-center' ] :
                                            [
                                              'border-r',
                                              'border-gray-200'
                                            ]
                                      ].join(' ')
                                    }
                                  >
                                    { ReactTable.flexRender(cell.column.columnDef.cell, cell.getContext()) }
                                  </TableCell>
                                )
                              )
                            }
                          </TableRow>
                        )
                      ) :
                      (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-24 text-center">
                            {t('table.noResults')}
                          </TableCell>
                        </TableRow>
                      )
                }

              </TableBody>
            </Table>
          </div>

          { /* ┉┉┉ ページネーション ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
          <div className="flex pb-8">
            <DataTablePagination table={ tableModel } />
          </div>

          { /* ┉┉┉ 保存ボタン ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
          <div className="flex justify-center space-x-3">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isSaving}
            >
              {isSaving ? t('controls.saving') : t('controls.save')}
            </button>
          </div>

        </div>
      </div>

      {/* 保存確認モーダル */}
      <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
        <DialogContent showCloseButton={false} className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.save.title')}</DialogTitle>
            <DialogDescription>{t('modals.save.message')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setShowSaveModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              disabled={isSaving}
            >
              {t('modals.save.cancel')}
            </button>
            <button
              type="button"
              onClick={confirmSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isSaving}
            >
              {isSaving ? t('controls.saving') : t('modals.save.confirm')}
            </button>
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
          {selectedDeleteItem && (
            <div className="bg-gray-50 p-3 rounded mb-4">
              <p className="text-sm text-gray-700">
                <span className="font-medium">{t('modals.delete.code')}</span> {selectedDeleteItem.generalCostCd}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">{t('table.headers.japaneseName')}:</span>{' '}
                {selectedDeleteItem.generalCostNameJa}
              </p>
            </div>
          )}
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedDeleteItem(null);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              {t('modals.delete.cancel')}
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              {t('modals.delete.confirm')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UniformCostItemCodeRegistration;
