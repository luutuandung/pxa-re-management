import type {
  BusinessCostWithNamesResponse,
  BusinessUnitItem,
  GeneralCostCode,
  GetBusinessUnitListResponse,
} from '@pxa-re-management/shared';
import * as ReactTable from '@tanstack/react-table';
import dayjs from 'dayjs';
import * as React from "react";
import { useTranslation } from 'react-i18next';
import { DataTablePagination } from '@/components/molecules/DataTablePagination';
import LocationSelectField from '@/components/molecules/LocationSelectField';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStickyMessageActions } from '@/store/stickyMessage';
import { api } from '@/utils/api-client';
import deleteIcon from '../assets/btn_delete.svg';

// フロントエンド固有の型定義（新構造対応）
interface BusinessCostItem {
  id: string;
  buCostCd: string;
  buCostNameJa: string;
  buCostNameEn: string;
  buCostNameZh: string;
  generalCostCd: string | null;
  deleteFlg: boolean;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  generalCostCode?: GeneralCostCode | null;
  isNew?: boolean;
  isChanged?: boolean; // 変更フラグを追加
  businessunitId?: string; // 拠点コード追加
}

const BusinessCostItemCodeRegistration: React.FC = (): React.ReactNode => {

  // i18n
  const { t } = useTranslation('businessCostItemCodeRegistration');
  // State
  const [locationFilter, setLocationFilter] = React.useState(''); // 絞り込み用（空文字は全表示）
  const [locations, setLocations] = React.useState<BusinessUnitItem[]>([]);
  const [locationItems, setLocationItems] = React.useState<BusinessCostItem[]>([]);
  const [originalLocationItems, setOriginalLocationItems] = React.useState<BusinessCostItem[]>([]);
  const [showInvalidItems, setShowInvalidItems] = React.useState(false);
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isChanged, setIsChanged] = React.useState(false);
  const [highlightedItemID, setHighlightedItemID] = React.useState<string | null>(null);

  // TanStack Table用のState
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 50,
  });
  const [columnFilters, setColumnFilters] = React.useState<ReactTable.ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<ReactTable.SortingState>([]);

  // stickyMessage actions
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();

  const fetchLocationItems = async (buCd: string) => {
    const allResponses = await api
      .get<BusinessCostWithNamesResponse[]>('businessCost/names', {
        searchParams: {
          buCd,
        },
      })
      .json();
    return allResponses.map((item) => convertToBusinessCostItem(item));
  };

  // BusinessCostWithNamesResponseをBusinessCostItemに変換する関数
  const convertToBusinessCostItem = React.useCallback(
    (data: BusinessCostWithNamesResponse): BusinessCostItem => ({
      id: data.buCostCodeId,
      buCostCd: data.buCostCd,
      buCostNameJa: data.buCostNameJa,
      buCostNameEn: data.buCostNameEn,
      buCostNameZh: data.buCostNameZh,
      generalCostCd: data.generalCostCd ?? '', // null の場合は空文字に変換
      deleteFlg: data.deleteFlg,
      createdBy: data.createdBy,
      createdOn: data.createdOn,
      modifiedBy: data.modifiedBy,
      modifiedOn: data.modifiedOn,
      generalCostCode: data.generalCostCode,
      isNew: false,
      isChanged: false, // 初期状態では変更なし
      businessunitId: data.businessunitId,
    }),
    []
  );

  const handleBusinessItemChange = React.useCallback(
    (id: string, field: keyof BusinessCostItem, value: string | boolean) => {
      // 全データを更新
      setLocationItems((items) =>
        items.map((item) => {
          if (item.id !== id) return item;

          const updatedItem = { ...item, [field]: value };

          // 変更フラグの設定
          if (!item.isNew) {
            // 既存の編集可能アイテムの場合、元の値から変更があるかチェック
            const originalItem = originalLocationItems.find((orig) => orig.id === id);
            if (originalItem) {
              updatedItem.isChanged =
                originalItem.buCostNameJa !== updatedItem.buCostNameJa ||
                originalItem.buCostNameEn !== updatedItem.buCostNameEn ||
                originalItem.buCostNameZh !== updatedItem.buCostNameZh;
            }
          } else {
            // 新規項目の場合、何かしら入力があるかチェック
            updatedItem.isChanged =
              updatedItem.buCostCd.trim() !== '' ||
              updatedItem.buCostNameJa.trim() !== '' ||
              updatedItem.buCostNameEn.trim() !== '' ||
              updatedItem.buCostNameZh.trim() !== '';
          }

          setIsChanged(true);

          return updatedItem;
        })
      );
    },
    [originalLocationItems, isChanged]
  );

  // 不足している関数を追加
  const removeItem = React.useCallback((id: string) => {
    setLocationItems((items) => items.filter((item) => item.id !== id));
  }, []);

  const handleDeleteExistingItem = React.useCallback(
    async (item: BusinessCostItem) => {
      try {
        setIsLoading(true);
        await api.put(`businessCost/${item.id}/deactivate`);
        addSuccessMessage(t('messages.deleteSuccess'));

        // ローカル状態更新
        handleBusinessItemChange(item.id, 'deleteFlg', true);
      } catch (_error) {
        addErrorMessage(t('messages.deleteError'));
      } finally {
        setIsLoading(false);
      }
    },
    [handleBusinessItemChange, addSuccessMessage, addErrorMessage, t]
  );

  const handleReactivate = React.useCallback(
    async (item: BusinessCostItem) => {
      try {
        setIsLoading(true);
        await api.put(`businessCost/${item.id}/reactivate`);
        addSuccessMessage(t('messages.activateSuccess'));

        // ローカル状態更新
        handleBusinessItemChange(item.id, 'deleteFlg', false);
      } catch (_error) {
        addErrorMessage(t('messages.activateError'));
      } finally {
        setIsLoading(false);
      }
    },
    [handleBusinessItemChange, addSuccessMessage, addErrorMessage, t]
  );

  // カラム定義
  const columns: ReactTable.ColumnDef<BusinessCostItem>[] = React.useMemo(
    () => [
      {
        accessorKey: 'buCostCd',
        header: () => <div className="text-left">{t('table.headers.code')}</div>,
        cell: ({ row: { original: item } }) => item.isNew ?
            (
              <input
                type="text"
                value={item.buCostCd}
                onChange={(e) => handleBusinessItemChange(item.id, 'buCostCd', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('table.placeholders.inputCode')}
              />
            ) :
            (<span className="text-sm text-gray-800">{item.buCostCd}</span>)
      },
      {
        accessorKey: 'buCostNameJa',
        header: () => <div className="text-left">{t('table.headers.japaneseName')}</div>,
        cell: ({ row: { original: item } }) =>
            (
              <input
                type="text"
                value={item.buCostNameJa}
                onChange={(e) => handleBusinessItemChange(item.id, 'buCostNameJa', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('table.placeholders.inputJapaneseName')}
                disabled={item.deleteFlg}
              />
            )
      },
      {
        accessorKey: 'buCostNameEn',
        header: () => <div className="text-left">{t('table.headers.englishName')}</div>,
        cell: ({ row: { original: item } }) =>
            (
              <input
                type="text"
                value={item.buCostNameEn}
                onChange={(e) => handleBusinessItemChange(item.id, 'buCostNameEn', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('table.placeholders.inputEnglishName')}
                disabled={item.deleteFlg}
              />
            )
      },
      {
        accessorKey: 'buCostNameZh',
        header: () => <div className="text-left">{t('table.headers.chineseName')}</div>,
        cell: ({ row: { original: item } }) =>
            (
              <input
                type="text"
                value={item.buCostNameZh}
                onChange={(e) => handleBusinessItemChange(item.id, 'buCostNameZh', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('table.placeholders.inputChineseName')}
                disabled={item.deleteFlg}
              />
            )
      },
      {
        accessorKey: 'generalCostCd',
        header: () => <div className="text-left">{t('table.headers.uniformCode')}</div>,
        cell: ({ row: { original: item } }) => item.generalCostCd ?? ''
      },
      {
        accessorKey: 'modifiedOn',
        header: ({ column }) => {
          return (
            <button
              className="flex items-center space-x-1 hover:text-gray-900"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <span>{t('table.headers.modifiedDate')}</span>
              {column.getIsSorted() === 'asc' && <span>↑</span>}
              {column.getIsSorted() === 'desc' && <span>↓</span>}
              {!column.getIsSorted() && <span className="text-gray-400">↑↓</span>}
            </button>
          );
        },
        cell: ({ row: { original: item } }) => item.isNew ?
            (
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <img src={deleteIcon} alt={t('table.deleteAlt')} className="w-6 h-6"/>
              </button>
            ) :
            (
              <span className="text-sm text-gray-800">
                {item.modifiedOn ? dayjs(item.modifiedOn).format('YYYY/MM/DD HH:mm') : '-'}
              </span>
            )
      },
      {
        id: 'actions',
        accessorKey: 'actions',
        header: () => <div className="text-center"></div>,
        cell: ({ row: { original: item } }) => {

          const actionType = getActionButtonType(item);

          return (
            !item.isNew &&
                (
                  actionType === 'delete' ?
                      (
                        <button
                          type="button"
                          onClick={() => handleDeleteExistingItem(item)}
                          className="text-red-600 hover:text-red-800"
                          disabled={isLoading}
                        >
                          <img src={deleteIcon} alt={t('table.deleteAlt')} className="w-4 h-4" />
                        </button>
                      ) : actionType === 'activate' ? (
                        <button
                          type="button"
                          onClick={() => handleReactivate(item)}
                          className="text-blue-600 hover:text-blue-800 underline hover:no-underline text-sm"
                          disabled={isLoading}
                        >
                          {t('controls.activate')}
                        </button>
                      ) :
                      null
                )
          );

        }
      }
    ],
    [t, removeItem, handleDeleteExistingItem, handleReactivate, handleBusinessItemChange, isLoading]
  );

  // 無効アイテムのフィルタリング
  const filteredData = React.useMemo(() => {
    if (!showInvalidItems) {
      return locationItems.filter((item) => !item.deleteFlg);
    }
    return locationItems;
  }, [locationItems, showInvalidItems]);

  // 無効トグルの変更時にページをリセット
  React.useEffect(
    (): void => {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [ showInvalidItems ]
  );

  React.useEffect(
    (): void => {
      setHighlightedItemID(null);
    },
    [ pagination.pageIndex ]
  );

  // TanStack Table設定
  const table = ReactTable.useReactTable({
    data: filteredData || [],
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

  // 初期化
  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 拠点一覧取得
        const locationsResponse = await api.get<GetBusinessUnitListResponse>('business-unit').json();
        setLocations(locationsResponse.businessUnits ?? []);
      } catch (_error) {
        addErrorMessage(t('messages.initialDataError'));
      }
    };

    fetchInitialData();
  }, []);

  const fetchAllBusinessCostData = async (buCd: string) => {
    try {
      setIsLoading(true);

      // 全拠点のデータを並行取得
      const allResponses = await fetchLocationItems(buCd);

      setLocationItems([...allResponses]);
      setOriginalLocationItems([...allResponses]);
      // 初期表示は全データを表示
    } catch (_error) {
      addErrorMessage(t('messages.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  // 初回データ取得（全拠点のデータを取得）
  React.useEffect(() => {
    if (!locationFilter.length) return;
    fetchAllBusinessCostData(locationFilter);
    setHighlightedItemID(null)
  }, [locationFilter]);

  // ユーティリティ関数
  const getActionButtonType = React.useCallback((item: BusinessCostItem): 'delete' | 'activate' | 'none' => {
    if (item.generalCostCode?.deleteFlg) return 'none';
    return item.deleteFlg ? 'activate' : 'delete';
  }, []);

  const onClickTableRow: (item: BusinessCostItem, event: React.MouseEvent) => void = React.useCallback(
    (item: BusinessCostItem, event: React.MouseEvent): void => {
      if ((event.target instanceof HTMLElement) && event.target.tagName === "TD") {
        setHighlightedItemID(
          (previousHighlightedItemID): string | null => previousHighlightedItemID === item.id ? null: item.id
        );
      }
    },
    [ setHighlightedItemID ]
  );

  function computeTableRowClassNameAttributeValue(
    { original: businessCostItem }: ReactTable.Row<BusinessCostItem>
  ): string {

    if (businessCostItem.id === highlightedItemID) {
      return 'bg-amber-100';
    }


    if (businessCostItem.deleteFlg) {
      return 'bg-gray-100';
    }


    if (businessCostItem.isNew) {
      return 'bg-green-50';
    }


    return '';

  }

  const createNewBusinessCostItem = React.useCallback((): BusinessCostItem => {
    const businessunitId = locationFilter || (locations.length > 0 ? locations[0].businessunitId : '');
    return {
      id: `new_${Date.now()}_${Math.random()}`,
      buCostCd: '',
      buCostNameJa: '',
      buCostNameEn: '',
      buCostNameZh: '',
      generalCostCd: ' ',
      deleteFlg: false,
      createdBy: '',
      createdOn: '',
      modifiedBy: '',
      modifiedOn: '',
      isNew: true,
      isChanged: false, // 初期状態では変更なし
      businessunitId,
    };
  }, [locationFilter, locations]);

  /*
   * 【日本語名】 項目を追加
   * 【関連仕様書】https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/12/
   * */
  const addBusinessItem: () => void = React.useCallback(
    (): void => {

      const newItem: BusinessCostItem = createNewBusinessCostItem();

      /* 【 論理・方法論 】
       * 表の行の指数や行のID指数を使うと、ややこしくなるから、UnifiedCostItemを使った方が良い。
       * ここでlocationItems配列が使われているが、実際に表示されているのはfilteredData配列なので、指数が一致しているとは限らない。 */

      setLocationItems(
        (existingItems: ReadonlyArray<BusinessCostItem>): Array<BusinessCostItem> =>
            highlightedItemID === null ?
                [ newItem, ...existingItems ] :
                existingItems.toSpliced(
                  existingItems.findIndex((existingItem: BusinessCostItem): boolean => existingItem.id === highlightedItemID) + 1,
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
    [ createNewBusinessCostItem, setLocationItems, highlightedItemID, pagination.pageIndex, setPagination ]
  );

  // 保存処理
  const handleSaveConfirm = async () => {
    try {
      setIsLoading(true);

      const businessCostItems = locationItems
        .filter((item) => {
          if (item.isNew) {
            // 新規項目：入力があるもの
            return (
              item.buCostCd.trim() !== '' &&
              (item.buCostNameJa.trim() !== '' || item.buCostNameEn.trim() !== '' || item.buCostNameZh.trim() !== '')
            );
          } else {
            // 既存項目：実際に変更があるもののみ
            return item.isChanged === true;
          }
        })
        .map((item) => ({
          ...(item.isNew ? {} : { buCostCodeId: item.id }),
          businessunitId: item.businessunitId || locations[0]?.buCd || '', // アイテム自体の拠点コードを使用
          generalCostCd: item.generalCostCd,
          buCostCd: item.buCostCd,
          buCostNameJa: item.buCostNameJa,
          buCostNameEn: item.buCostNameEn,
          buCostNameZh: item.buCostNameZh,
          deleteFlg: item.deleteFlg,
        }));

      await api.post('businessCost/save', {
        json: { businessCostItems },
      });

      addSuccessMessage(t('messages.saveSuccess'));
      setShowSaveDialog(false);
      setIsChanged(false);

      // データ再取得（全拠点）
      const allItems = await fetchLocationItems(locationFilter);
      setLocationItems([...allItems]);
      setOriginalLocationItems([...allItems]); // 元データも更新
    } catch (_error) {
      addErrorMessage(t('messages.saveError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">

        { /* ┉┉┉ ページ見出し ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <div className="h-0.5 bg-blue-600 w-full"></div>
        </div>

          <div className="p-6">

            { /* ┉┉┉ 補助見出し ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
            <h2 className="text-lg font-semibold text-gray-800 mb-6">{t('sections.businessCostItems')}</h2>

            { /* ┉┉┉ トップアクションバー ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
            <div className="flex justify-between items-center mb-6">

              <div className="flex items-center space-x-6">

                {/* 拠点絞り込み */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{t('controls.locationFilter')}</span>
                  <LocationSelectField
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                    locations={locations}
                    selectClassName="w-[200px]"
                    className="rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 無効表示トグル */}
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

              </div>

              <button
                type="button"
                onClick={ addBusinessItem }
                className={`px-4 py-2 rounded text-sm ${
                  locationFilter === '' || isLoading
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={locationFilter === '' || isLoading}
                title={locationFilter === '' ? t('validation.selectLocation') : ''}
              >
                {t('controls.add')}
              </button>

            </div>

            { /* ┉┉┉ データ表示テーブル ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
            <div className="overflow-x-auto mb-6">
              <div className="border border-gray-200 rounded-lg mb-6">
                <Table>

                  { /* ┅┅┅ ヘッダー ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */ }
                  <TableHeader className="bg-[#00388E] text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead
                              key={header.id}
                              className="border-r border-gray-200 px-4 py-3 text-left text-sm font-medium"
                            >
                              {header.isPlaceholder
                                ? null
                                : ReactTable.flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>

                  { /* ┅┅┅ ボディ ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */ }
                  <TableBody className="bg-white">
                    {
                      table.getRowModel().rows.length > 0 ? (
                        table.getRowModel().rows.map(
                          (row) => (
                            <TableRow
                              key={ row.id }
                              className={ computeTableRowClassNameAttributeValue(row) }
                              onClick={ (event: React.MouseEvent): void => { onClickTableRow(row.original, event); } }
                            >
                              {
                                row.getVisibleCells().map(
                                  (cell) => (
                                    <TableCell
                                      key={ cell.id }
                                      className={
                                        [
                                          'px-4',
                                          'py-3',
                                          ...cell.id === 'ACTIONS' || cell.id === 'modifiedOn' ? [ 'text-center' ] : []
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
                        )
                      ) : (
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
            </div>

            { /* ┉┉┉ ページネーション ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
            <div className="flex pb-8">
              <DataTablePagination table={table} />
            </div>

            { /* ┉┉┉ 保存ボタン ┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉┉ */ }
            <div className="flex justify-center space-x-3">
              <button
                type="button"
                onClick={() => setShowSaveDialog(true)}
                className={`px-4 py-2 rounded text-sm ${
                  locationFilter === '' || isLoading || !isChanged
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={locationFilter === '' || isLoading || !isChanged}
              >
                {isLoading ? t('controls.saving') : t('controls.save')}
              </button>
            </div>
          </div>
      </div>

      {/* 保存確認モーダル */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent showCloseButton={false} className="bg-white">
          <DialogHeader>
            <DialogTitle>{t('modals.save.title')}</DialogTitle>
            <DialogDescription>{t('modals.save.message')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setShowSaveDialog(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              disabled={isLoading}
            >
              {t('modals.save.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSaveConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? t('controls.saving') : t('modals.save.confirm')}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusinessCostItemCodeRegistration;
