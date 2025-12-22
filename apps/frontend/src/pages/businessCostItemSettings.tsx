import {
  type BusinessCostItemResponse,
  type BusinessCostItemWithCode,
  type BusinessUnit,
  type UpdatedBusinessCostItemRequestData,
  UpdatedBusinessCostItemRequestDataValidator,
  CodesOfAvailableCurrencies,
  BusinessUnitTransactions
} from '@pxa-re-management/shared';
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DataTablePagination } from '@/components/molecules/DataTablePagination';
import LocationSelectField from "@/components/atoms/LocationSelectField.tsx";
import Alert from "@/components/molecules/Alert.tsx";
import Backdrop from "@/components/molecules/Backdrop.tsx";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLanguage } from '@/store/languageSettings';
import { useStickyMessageActions } from '@/store/stickyMessage';
import { api } from '@/utils/api-client';
import ExcelHelper from "@/utils/ExcelHelper.ts";
import CSS_Classes from "./businessCostItemSettings.module.sass";


// フォームデータの型定義
type FormData = {
  items: BusinessCostItemWithCode[];
};


type RawUpdatedBusinessCostItemRequestData = Readonly<{ [ keys in keyof UpdatedBusinessCostItemRequestData ]: unknown; }>;

export type SpreadsheetValidationErrorsForSpecificLine = {
  lineNumber: number;
  messages: ReadonlyArray<string>;
}


const supportedSpreadsheetsFileNameExtensionsWithLeadingDots: ReadonlyArray<string> = [ ".xlsx" ];

const BusinessCostItemSettings: React.FC = (): React.ReactNode => {

  const { t } = useTranslation('businessCostItemSettings');
  const { currentLanguage } = useLanguage();


  /* ━━━ React Hook Form設定 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const { control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      items: [],
    },
  });

  const { append } = useFieldArray({
    control,
    name: 'items',
  });

  const formItems = watch('items');


  /* ━━━ ステート管理 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const [ selectedBase, setSelectedBase ] = React.useState<null | string>(null);
  const [ locations, setLocations ] = React.useState<BusinessUnit[]>([]);
  const [ _selectedLanguage, _setSelectedLanguage ] = React.useState('0');
  const [ _showInactive, _setShowInactive ] = React.useState(false);
  const [ showSaveDialog, setShowSaveDialog ] = React.useState(false);
  const [ showDeleteDialog, setShowDeleteDialog ] = React.useState(false);
  const [ showValidDialog, setShowValidDialog ] = React.useState(false);
  const [ exportingFromExcelValidationErrors, setExportingFromExcelValidationErrors ] =
      React.useState<ReadonlyArray<SpreadsheetValidationErrorsForSpecificLine>>([]);
  const [ targetItemId, setTargetItemId ] = React.useState<string | null>(null);
  const [ costItemOrigins, setCostItemOrigins ] = React.useState<BusinessCostItemWithCode[]>([]);
  const [ columnFilters, setColumnFilters ] = React.useState<ColumnFiltersState>([]);
  const [ nameFilter, setNameFilter] = React.useState('');
  const [ isSaving, setIsSaving] = React.useState(false);
  const [ pagination, setPagination ] = React.useState({ pageIndex: 0, pageSize: 20, });


  /* ━━━ トーストメッセージ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const {
    addSuccessMessage: addSuccessToastMessage,
    addErrorMessage: addErrorToastMessage
  } = useStickyMessageActions();

  // React Hook Form用のフィールド変更処理（最適化版）
  const handleFieldChange = React.useCallback(
    (itemId: string, field: string, value: any) => {
      // 現在のフォームデータを直接取得（再レンダリングを避ける）
      const currentItems = formItems || [];
      const itemIndex = currentItems.findIndex((item) => item.buCostItemId === itemId);

      if (itemIndex !== -1) {
        // バッチ更新でパフォーマンス向上
        setValue(`items.${itemIndex}.${field}` as any, value, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: false, // バリデーションは保存時のみ実行
        });
      }
    },
    [formItems, setValue]
  );

  // チェックボックス専用の最適化されたハンドラー
  const handleCheckboxChange = React.useCallback(
    (itemId: string, field: string) => (checked: boolean) => {
      handleFieldChange(itemId, field, checked);
    },
    [handleFieldChange]
  );

  // 年月の初期値と選択肢を取得する関数（修正版）
  const getYearOptions = React.useCallback((startDate: string) => {
    const currentYear = new Date().getFullYear();
    const itemYear = parseInt(startDate.substring(0, 4));

    // 過去の年月の場合はそのままの値 + 現在年 + 3年分（合計4年）
    if (itemYear < currentYear) {
      return Array.from({ length: 4 }, (_, i) => (itemYear + i).toString());
    }

    // 現在年および未来の年月の場合はその年から3年分のみ（合計3年）
    return Array.from({ length: 3 }, (_, i) => (itemYear + i).toString());
  }, []);

  const getMonthOptions = React.useCallback(() => {
    // 01~12の固定表示
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, []);

  // 終了日の年選択肢を取得する関数（開始日を考慮）
  const getEndYearOptions = React.useCallback((startDate: string, _endDate: string) => {
    const startYear = parseInt(startDate.substring(0, 4));
    const currentYear = new Date().getFullYear();

    // 開始年から3年後まで、または現在年から3年後までの大きい方
    const minYear = Math.max(startYear, currentYear);
    return Array.from({ length: 4 }, (_, i) => (minYear + i).toString());
  }, []);

  // 終了日の月選択肢を取得する関数（01~12の固定表示）
  const getEndMonthOptions = React.useCallback(() => {
    // 01~12の固定表示
    return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  }, []);

  // 各アイテムの年月選択肢をメモ化して保存
  const [itemYearOptions, setItemYearOptions] = React.useState<Record<string, string[]>>({});
  const [itemEndYearOptions, setItemEndYearOptions] = React.useState<Record<string, string[]>>({});

  // アイテムの年月選択肢を初期化する関数
  const initializeItemYearOptions = React.useCallback(
    (item: BusinessCostItemWithCode) => {
      const itemId = item.buCostItemId;
      const startDate = item.startDate;
      const endDate = item.endDate;

      // 開始日の年選択肢を設定
      const startYearOptions = getYearOptions(startDate);
      setItemYearOptions((prev) => ({
        ...prev,
        [itemId]: startYearOptions,
      }));

      // 終了日の年選択肢を設定
      const endYearOptions = getEndYearOptions(startDate, endDate);
      setItemEndYearOptions((prev) => ({
        ...prev,
        [itemId]: endYearOptions,
      }));
    },
    [getYearOptions, getEndYearOptions]
  );

  // アイテムが追加された時に選択肢を初期化
  React.useEffect(() => {
    const currentItems = formItems || [];
    currentItems.forEach((item) => {
      if (!itemYearOptions[item.buCostItemId]) {
        initializeItemYearOptions(item);
      }
    });
  }, [formItems, itemYearOptions, initializeItemYearOptions]);

  // 年月の値を分割して取得
  const getYearFromDate = React.useCallback((date: string): string => date.substring(0, 4), []);

  const getMonthFromDate = React.useCallback((date: string): string => date.substring(4, 6), []);

  // 年月を結合して日付を作成
  const combineYearMonth = React.useCallback((year: string, month: string): string => year + month, []);

  // 重複チェック関数（関数型アプローチ）
  const checkDuplicates = React.useCallback(
    (targetItem: BusinessCostItemWithCode) => {
      const currentItems = formItems || [];
      return currentItems.some(
        (existing) =>
          existing.buCostCode.buCostCodeId === targetItem.buCostCode.buCostCodeId &&
          existing.curCd === targetItem.curCd &&
          existing.buCostItemId !== targetItem.buCostItemId
      );
    },
    [formItems]
  );

  // コピー処理（関数型アプローチ）
  const handleCopy = React.useCallback(
    (itemId: string) => {
      const currentItems = formItems || [];
      const item = currentItems.find((i) => i.buCostItemId === itemId);

      // 早期リターン：アイテムが見つからない場合
      if (!item) return;

      // 早期リターン：重複がある場合
      if (checkDuplicates(item)) {
        addErrorToastMessage(t('messages.duplicateError'));
        return;
      }

      const newItem = {
        ...item,
        buCostItemId: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      append(newItem);
    },
    [formItems, checkDuplicates, addErrorToastMessage, t, append]
  );

  /* 【 仕様書 】 現時点では中国が未対応だが、対応予定有り。 https://dev.azure.com/lscm-pxa-re/pxa-re/_workitems/edit/18 */
  const getBusinessUnitCostItemLocalizedName = React.useCallback(
    (item: BusinessCostItemWithCode): string => {
      switch (currentLanguage) {
        case 'en':
          return item.buCostCode.buCostNameEn;
        default:
          return item.buCostCode.buCostNameJa;
      }
    },
    [currentLanguage]
  );

  // カラム定義
  const columns: ColumnDef<BusinessCostItemWithCode>[] = React.useMemo(
    () => [
      {
        accessorKey: 'buCostCode.buCostCd',
        header: () => <div className="text-center">{t('table.headers.code')}</div>,
        cell: ({ row }) => <div className="text-sm text-center border-r-0">{row.original.buCostCode.buCostCd}</div>,
      },
      {
        id: 'costItemName',
        accessorFn: (row) => getBusinessUnitCostItemLocalizedName(row),
        header: () => <div className="text-center">{t('table.headers.costItemName')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-sm">
              { getBusinessUnitCostItemLocalizedName(item) }
              {item.buCostItemId.startsWith('temp_') && (
                <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {t('table.labels.new')}
                </span>
              )}
            </div>
          );
        },
        filterFn: (row, _columnId, value) => {
          // 現在の言語設定に応じた名前でフィルタリング
          const itemName = getBusinessUnitCostItemLocalizedName(row.original).toLowerCase();
          return itemName.includes(value.toLowerCase());
        },
      },
      {
        accessorKey: 'startDate',
        header: () => <div className="text-center">{t('table.headers.startDate')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          const yearOptions = itemYearOptions[item.buCostItemId] || getYearOptions(item.startDate);
          const monthOptions = getMonthOptions();

          return (
            <div className="flex items-center gap-1">
              <Select
                value={getYearFromDate(item.startDate)}
                onValueChange={(value) => {
                  const newDate = combineYearMonth(value, getMonthFromDate(item.startDate));
                  handleFieldChange(item.buCostItemId, 'startDate', newDate);
                }}
              >
                <SelectTrigger className="w-[80px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm">{t('table.labels.year')}</span>
              <Select
                value={getMonthFromDate(item.startDate)}
                onValueChange={(value) => {
                  const newDate = combineYearMonth(getYearFromDate(item.startDate), value);
                  handleFieldChange(item.buCostItemId, 'startDate', newDate);
                }}
              >
                <SelectTrigger className="w-[65px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((month) => (
                    <SelectItem key={`selectMonth-${month}`} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm">{t('table.labels.month')}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'endDate',
        header: () => <div className="text-center">{t('table.headers.endDate')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          const endYearOptions =
            itemEndYearOptions[item.buCostItemId] || getEndYearOptions(item.startDate, item.endDate);
          const endMonthOptions = getEndMonthOptions();

          return (
            <div className="flex items-center gap-1">
              <Select
                value={getYearFromDate(item.endDate)}
                onValueChange={(value) => {
                  const newDate = combineYearMonth(value, getMonthFromDate(item.endDate));
                  handleFieldChange(item.buCostItemId, 'endDate', newDate);
                }}
              >
                <SelectTrigger className="w-[80px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {endYearOptions.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm">{t('table.labels.year')}</span>
              <Select
                value={getMonthFromDate(item.endDate)}
                onValueChange={(value) => {
                  const newDate = combineYearMonth(getYearFromDate(item.endDate), value);
                  handleFieldChange(item.buCostItemId, 'endDate', newDate);
                }}
              >
                <SelectTrigger className="w-[65px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {endMonthOptions.map((month) => (
                    <SelectItem key={`selectMonth-${month}`} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm">{t('table.labels.month')}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'curCd',
        header: () => <div className="text-center">{t('table.headers.currency')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Select value={item.curCd} onValueChange={(value) => handleFieldChange(item.buCostItemId, 'curCd', value)}>
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {
                  Object.values(CodesOfAvailableCurrencies).map(
                    (currencyCode: CodesOfAvailableCurrencies): React.ReactNode => (
                      <SelectItem key={ currencyCode } value={ currencyCode }>
                        { currencyCode }
                      </SelectItem>
                    )
                  )
                }
              </SelectContent>
            </Select>
          );
        },
      },
      {
        accessorKey: 'amountValidFlg',
        header: () => <div className="text-center">{t('table.headers.amount')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              <Checkbox
                checked={item.amountValidFlg}
                onCheckedChange={handleCheckboxChange(item.buCostItemId, 'amountValidFlg')}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'rateValidFlg',
        header: () => <div className="text-center">{t('table.headers.rate')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              <Checkbox
                checked={item.rateValidFlg}
                onCheckedChange={handleCheckboxChange(item.buCostItemId, 'rateValidFlg')}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'calcValidFlg',
        header: () => <div className="text-center">{t('table.headers.calculation')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              <Checkbox
                checked={item.calcValidFlg}
                onCheckedChange={handleCheckboxChange(item.buCostItemId, 'calcValidFlg')}
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'autoCreateValidFlg',
        header: () => <div className="text-center">{t('table.headers.autoCreate')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              <Checkbox
                checked={item.autoCreateValidFlg}
                onCheckedChange={handleCheckboxChange(item.buCostItemId, 'autoCreateValidFlg')}
              />
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: () => <div className="text-center">{t('table.headers.actions')}</div>,
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="text-center">
              <Button
                onClick={() => handleCopy(item.buCostItemId)}
                className="bg-[#00388E] hover:bg-[#002a6e] text-white text-xs px-2 py-1"
              >
                {t('buttons.copy')}
              </Button>
            </div>
          );
        },
      },
    ],
    [
      t,
      getBusinessUnitCostItemLocalizedName,
      currentLanguage,
      getYearFromDate,
      getMonthFromDate,
      combineYearMonth,
      getYearOptions,
      getMonthOptions,
      getEndYearOptions,
      getEndMonthOptions,
      itemYearOptions,
      itemEndYearOptions,
      handleFieldChange,
      handleCheckboxChange,
      handleCopy,
    ]
  );

  // TanStack Table設定（最適化版）
  const table = useReactTable({
    data: formItems || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      pagination,
    },
    // フィルタリングのデバウンス設定
    globalFilterFn: 'includesString',
    enableColumnFilters: true,
  });


  /* ━━━ アクション処理 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  /* ┅┅┅ エクセル関連 ┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅ */
  /* ╍╍╍ インポート ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */

  /* 【 日本語名 】 ファイルアップロード用の隠しinput要素のReactレファレンス */
  const fileInputElementReactReference: React.RefObject<HTMLInputElement | null> =
      React.useRef<HTMLInputElement>(null);

  /* 【 日本語名 】 ファイル選択ダイヤログを開く */
  const onPickExcelFileEventHandler: () => void = React.useCallback(
    (): void => {

      if (selectedBase === null) {
        addErrorToastMessage(t('messages.excelImportingExportingGuidance'));
        return;
      }


      fileInputElementReactReference.current?.click();

    },
    [ selectedBase, addErrorToastMessage ]
  );

  /* 【 日本語名 】 ファイルが選択されて以降の処理 */
  const onExcelFilePickedEventHandler: (changingEvent: React.ChangeEvent<HTMLInputElement>) => Promise<void> = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {

      const targetFile: File | undefined = event.target.files?.[0];

      if (typeof targetFile === "undefined") {
        console.error('ファイルの一覧は空になっている。');
        return;
      }


      /* 【 方法論 】 正しい値が入っている`input`要素の`accept`アトリビュートが存在している限り、起きないので、コンソール通知だけで良い。 */
      if (
        !supportedSpreadsheetsFileNameExtensionsWithLeadingDots.some(
          (supportedSpreadsheetFilenameExtensionWithLeadingDot: string): boolean =>
              targetFile.name.endsWith(supportedSpreadsheetFilenameExtensionWithLeadingDot)
        )
      ) {
        console.error(`ファイル「${ targetFile.name }」はサポートされていないファイル名拡張子を含めている。`);
        return;
      }


      Backdrop.display({ accessibilityGuidance: 'messages.screenReaderOnly.excelFileExportingInProgress' });

      let rawUpdatedBusinessCostItemRequestData: ReadonlyArray<RawUpdatedBusinessCostItemRequestData>;

      try {

        rawUpdatedBusinessCostItemRequestData = await ExcelHelper.parseFile({
          targetFile,
          buildItem: (cellsContent: ReadonlyArray<unknown>): RawUpdatedBusinessCostItemRequestData =>
              ({
                buCostItemId: cellsContent[0],
                startDate: cellsContent[3],
                endDate: cellsContent[4],
                curCd: cellsContent[5],
                amountValidFlg: cellsContent[6],
                rateValidFlg: cellsContent[7],
                calcValidFlg: cellsContent[8],
                autoCreateValidFlg: cellsContent[9]
              }),
          mustSkipFirstRow: true
        });

      } catch (error) {

        console.error('エクセルファイル処理エラー:', error);
        addErrorToastMessage(t('messages.excelDataParsingFailed'));
        Backdrop.dismiss();

        return;

      }


      const rawUpdatedBusinessCostItemRequestDataValidationResult: UpdatedBusinessCostItemRequestDataValidator.ValidationResult =
          UpdatedBusinessCostItemRequestDataValidator.validate(rawUpdatedBusinessCostItemRequestData);

      if (rawUpdatedBusinessCostItemRequestDataValidationResult.isInvalid) {

        setExportingFromExcelValidationErrors(
          rawUpdatedBusinessCostItemRequestDataValidationResult.validationErrorsDataForEachItem.map(
            (
              { itemIndex, dataForEachError }: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorsDataForSpecificItem
            ): SpreadsheetValidationErrorsForSpecificLine =>
                ({
                  lineNumber: itemIndex + 2,
                  messages: dataForEachError.map(
                    ({ code, ...parameters }: UpdatedBusinessCostItemRequestDataValidator.ValidationErrorData): string =>
                        t(`validation.${ code }`, parameters)
                  )
                })
          )
        );

        Backdrop.dismiss();

        return;

      }


      /* 【 方法論 】 前回の試しから未削除のバリデーションエラーが残っている事がある。 */
      setExportingFromExcelValidationErrors([]);

      try {

        await api.put(
          'bu-cost-item/bulk/update',
          { json: rawUpdatedBusinessCostItemRequestDataValidationResult.items }
        );

      } catch (error) {

        console.error('エクセルファイルからのデータ送信中エラーが発生:', error);
        addErrorToastMessage(t('messages.importedFromExcelDataSubmittingError'));
        Backdrop.dismiss();

        return;

      }


      addSuccessToastMessage(t('messages.uploadSuccess'));

      const businessCostItems = await fetchBusinessCostItems();
      setValue('items', businessCostItems);
      setCostItemOrigins(businessCostItems);
      Backdrop.dismiss();

      (fileInputElementReactReference.current ?? { value: '' }).value = '';

    },
    [
      addErrorToastMessage,
      setExportingFromExcelValidationErrors,
      addSuccessToastMessage,
      t,
      selectedBase
    ]
  );


  /* ╍╍╍ インポート ╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍╍ */
  /* 【 日本語名 】 スプレッドシートにエクスポートするボタンクリック処理  */
  const onClickExportToExcelButtonEventHandler = React.useCallback(
    (): void => {

      if (selectedBase === null) {
        addErrorToastMessage(t('messages.excelImportingExportingGuidance'));
        return;
      }


      try {

        ExcelHelper.writeDataToFile({
          headerCellsContent: [
            "ID",
            t('table.headers.code'),
            t('table.headers.costItemName'),
            t('table.headers.startDate'),
            t('table.headers.endDate'),
            t('table.headers.currency'),
            t('table.headers.amount'),
            t('table.headers.rate'),
            t('table.headers.calculation'),
            t('table.headers.autoCreate')
          ],
          bodyCellsContent: formItems,
          transformItemToCellsArray: (businessCostItemWithCode: BusinessCostItemWithCode): Array<string | number | boolean> =>
              [
                businessCostItemWithCode.buCostItemId,
                businessCostItemWithCode.buCostCode.buCostCd,
                getBusinessUnitCostItemLocalizedName(businessCostItemWithCode),
                businessCostItemWithCode.startDate,
                businessCostItemWithCode.endDate,
                businessCostItemWithCode.curCd,
                businessCostItemWithCode.amountValidFlg,
                businessCostItemWithCode.rateValidFlg,
                businessCostItemWithCode.calcValidFlg,
                businessCostItemWithCode.autoCreateValidFlg
              ],
          outputFileNameWithExtension: 'cost_item_setting_sample.xlsx'
        });

      } catch (error: unknown) {

        console.error("XLSXファイル生成の際エラーが発生", error);
        addErrorToastMessage(t('messages.headers.code'));

      }

    },
    [
      selectedBase,
      addErrorToastMessage,
      t,
      formItems,
      getBusinessUnitCostItemLocalizedName
    ]
  );


  // 変更チェック関数（関数型アプローチ）
  const hasChanges = React.useCallback((current: BusinessCostItemWithCode, original: BusinessCostItemWithCode) => {
    return [
      current.startDate !== original.startDate,
      current.endDate !== original.endDate,
      current.curCd !== original.curCd,
      current.amountValidFlg !== original.amountValidFlg,
      current.rateValidFlg !== original.rateValidFlg,
      current.calcValidFlg !== original.calcValidFlg,
      current.autoCreateValidFlg !== original.autoCreateValidFlg,
    ].some(Boolean);
  }, []);

  // 保存対象のデータを抽出する関数（関数型アプローチ）
  const getItemsToSave = React.useCallback(() => {
    const currentItems = formItems || [];

    // 新規アイテムの抽出と変換
    const newItems = currentItems
      .filter((item) => item.buCostItemId.startsWith('temp_'))
      .map((item) => ({
        buCostCodeId: item.buCostCode.buCostCodeId,
        startDate: item.startDate,
        endDate: item.endDate,
        curCd: item.curCd,
        amountValidFlg: item.amountValidFlg,
        rateValidFlg: item.rateValidFlg,
        calcValidFlg: item.calcValidFlg,
        autoCreateValidFlg: item.autoCreateValidFlg,
      }));

    // 更新アイテムの抽出と変換
    const updates = currentItems
      .filter((item) => !item.buCostItemId.startsWith('temp_'))
      .map((item) => {
        const originalItem = costItemOrigins.find((orig) => orig.buCostItemId === item.buCostItemId);
        return { item, originalItem };
      })
      .filter(({ originalItem }) => originalItem !== undefined)
      .filter(({ item, originalItem }) => originalItem && hasChanges(item, originalItem))
      .map(({ item }) => ({
        buCostItemId: item.buCostItemId,
        startDate: item.startDate,
        endDate: item.endDate,
        curCd: item.curCd,
        amountValidFlg: item.amountValidFlg,
        rateValidFlg: item.rateValidFlg,
        calcValidFlg: item.calcValidFlg,
        autoCreateValidFlg: item.autoCreateValidFlg,
      }));

    return { newItems, updates };
  }, [formItems, costItemOrigins, hasChanges]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const itemsToSave = getItemsToSave();

      // 早期リターン：変更がない場合
      if (itemsToSave.newItems.length === 0 && itemsToSave.updates.length === 0) {
        addSuccessToastMessage(t('messages.noChanges'));
        setShowSaveDialog(false);
        return;
      }

      // 一括API呼び出し
      await api.put('bu-cost-item/bulk', {
        json: itemsToSave,
      });

      addSuccessToastMessage(t('messages.saveSuccess'));
      setShowSaveDialog(false);

      // データを再取得
      const businessCostItems = await fetchBusinessCostItems();
      setValue('items', businessCostItems);
      setCostItemOrigins(businessCostItems);
    } catch (error) {
      console.error('保存エラー:', error);
      addErrorToastMessage(t('messages.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const _fetchLocations = async (): Promise<Array<BusinessUnit>> => {
    try {
      return api.get<Array<BusinessUnit>>(BusinessUnitTransactions.RetrievingOfAll.URI_PATH).json();
    } catch (_error) {
      addErrorToastMessage(t('messages.fetchError'));
      return [];
    }
  };

  const fetchBusinessCostItems = async () => {

    if (selectedBase === null) {
      console.error('「fetchBusinessCostItems」の呼び出しの際、「selectedBase」が非nullと期待されていたが事実上nullのまま。');
      return [];
    }


    const response = await api
      .get<BusinessCostItemResponse>('bu-cost-item', {
        searchParams: {
          businessunitId: selectedBase,
        },
      })
      .json();

    return response.items;
  };

  React.useEffect(() => {
    const asyncFunc = async () => {
      const locations = await _fetchLocations();
      setLocations(locations);
    };
    asyncFunc();
  }, []);

  React.useEffect(() => {
    if (!selectedBase || selectedBase === '0') return;
    const asyncFunc = async () => {
      const businessCostItems = await fetchBusinessCostItems();
      setValue('items', businessCostItems);
      setCostItemOrigins(businessCostItems);
    };
    asyncFunc();
  }, [selectedBase, setValue]);

  // フィルター入力処理（デバウンス削除）
  const handleFilterChange = React.useCallback(
    (value: string) => {
      setNameFilter(value);
      table.getColumn('costItemName')?.setFilterValue(value);
    },
    [table]
  );

  // 言語変更時にフィルターをクリア
  React.useEffect(() => {
    setNameFilter('');
    const column = table.getColumn('costItemName');
    if (column) {
      column.setFilterValue('');
    }
  }, [currentLanguage, table]);

  const handleCancel = () => {
    console.log('Cancel');
    // 変更を破棄して元のデータに戻す
    setValue('items', costItemOrigins);
  };

  const confirmDelete = () => {
    if (targetItemId) {
      const currentItems = formItems || [];
      setValue(
        'items',
        currentItems.filter((item) => item.buCostItemId !== targetItemId)
      );
      setTargetItemId(null);
    }
    setShowDeleteDialog(false);
  };

  // 保存対象のデータがあるかチェック
  const hasChangesToSave = React.useMemo(() => {
    const currentItems = formItems || [];

    // 新規アイテム（temp_で始まるID）があるかチェック
    const hasNewItems = currentItems.some((item) => item.buCostItemId.startsWith('temp_'));

    // 変更されたアイテムがあるかチェック
    const hasUpdatedItems = currentItems.some((item) => {
      if (item.buCostItemId.startsWith('temp_')) return false;
      const originalItem = costItemOrigins.find((orig) => orig.buCostItemId === item.buCostItemId);
      return originalItem && hasChanges(item, originalItem);
    });

    return hasNewItems || hasUpdatedItems;
  }, [formItems, costItemOrigins, hasChanges]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-bold text-[#00388E] mb-2">{t('title')}</h1>
        <div
          role="none"
          className="h-1 bg-[#00388E] w-full mb-6"
        />

        <div className="mb-4 flex items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{t('controls.locationFilter')}</span>
            <LocationSelectField
              value={selectedBase}
              onValueChange={setSelectedBase}
              locations={locations}
              className="w-[200px]"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="nameFilter" className="text-sm font-medium">
              {t('controls.nameSearch')}
            </label>
            <Input
              id="nameFilter"
              type="text"
              value={nameFilter}
              onChange={(event) => handleFilterChange(event.target.value)}
              placeholder={t('controls.nameSearchPlaceholder')}
              className="w-[200px]"
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4 justify-end items-center">
          <Button
            onClick={ onPickExcelFileEventHandler }
            className="bg-[#00388E] hover:bg-[#002a6e] text-white"
          >
            { t('controls.fileUpload') }
          </Button>
          <Button
            onClick={ onClickExportToExcelButtonEventHandler }
            className="bg-[#00388E] hover:bg-[#002a6e] text-white"
          >
            { t('controls.fileDownload') }
          </Button>
        </div>

        {
          exportingFromExcelValidationErrors.length > 0 ?
              (
                <Alert
                  className="mb-4"
                  severity={ Alert.Severities.error }
                  onClickDismissingButton={ (): void => { setExportingFromExcelValidationErrors([]) } }
                >
                  <span className="font-medium">{ t('validation.intro') }</span>
                  <dl className={ CSS_Classes.ValidationErrorsList }>
                    {
                      exportingFromExcelValidationErrors.map(
                        ({ lineNumber, messages }: SpreadsheetValidationErrorsForSpecificLine): React.ReactNode =>
                            <React.Fragment key={ lineNumber }>
                              <dt>{ `${ lineNumber }行目` }</dt>
                              <dd>
                                <ul className="list-disc list-inside">
                                  {
                                    messages.map(
                                      (message: string): React.ReactNode =>
                                          <li key={ `${ lineNumber }-${ message }` }>{ message }</li>
                                    )
                                  }
                                </ul>
                              </dd>
                            </React.Fragment>
                      )
                    }
                  </dl>
                </Alert>
              ) :
              null
        }

        <div className="border border-gray-300 rounded-lg mb-6">
          <Table>
            <TableHeader className="bg-[#00388E] text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-white">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b border-gray-200 hover:bg-gray-50 bg-white">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t('table.noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ページネーションコンポーネント */}
        <div className="flex pb-8">
          <DataTablePagination table={table} />
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={() => setShowSaveDialog(true)}
            disabled={!hasChangesToSave || isSaving}
            className="bg-[#00388E] hover:bg-[#002a6e] text-white px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? t('buttons.saving') : t('buttons.save')}
          </Button>
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-[#00388E] text-[#00388E] hover:bg-gray-100 px-8 py-2"
          >
            {t('buttons.cancel')}
          </Button>
        </div>

        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent showCloseButton={false} className="bg-white">
            <DialogHeader>
              <DialogTitle>{t('modals.save.title')}</DialogTitle>
              <DialogDescription>
                {(() => {
                  const itemsToSave = getItemsToSave();
                  const newCount = itemsToSave.newItems.length;
                  const updateCount = itemsToSave.updates.length;

                  if (newCount > 0 && updateCount > 0) {
                    return t('modals.save.bothItems', { newCount, updateCount });
                  } else if (newCount > 0) {
                    return t('modals.save.newItems', { count: newCount });
                  } else {
                    return t('modals.save.updatedItems', { count: updateCount });
                  }
                })()}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                {t('modals.save.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? t('buttons.saving') : t('modals.save.confirm')}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent showCloseButton={false} className="bg-white">
            <DialogHeader>
              <DialogTitle>{t('modals.delete.title')}</DialogTitle>
              <DialogDescription>{t('modals.delete.message')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                {t('modals.delete.cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                {t('modals.delete.confirm')}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showValidDialog} onOpenChange={setShowValidDialog}>
          <DialogContent showCloseButton={false} className="bg-white">
            <DialogHeader>
              <DialogTitle>{t('modals.activate.title')}</DialogTitle>
              <DialogDescription>{t('modals.activate.message')}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setShowValidDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                {t('modals.activate.cancel')}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

         <input
          ref={ fileInputElementReactReference }
          type="file"
          accept={ supportedSpreadsheetsFileNameExtensionsWithLeadingDots.join(",") }
          onChange={ onExcelFilePickedEventHandler }
          style={ { display: 'none' } }
        />

      </div>
    </div>
  );
};


export default BusinessCostItemSettings;
