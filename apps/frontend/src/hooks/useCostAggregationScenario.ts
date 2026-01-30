import {
  AggClass,
  type AxisDependentOptionsResponse,
  type AxisOption,
  type BusinessUnit,
  type GetConcatTargetsResponse,
  type GetCostScenarioOptionsResponse,
  type ScenarioBusinessOption,
  type ScenarioTypeOption,
  type SelectOption,
  type TableRowData,
  BusinessUnitTransactions,
} from '@pxa-re-management/shared';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/store/languageSettings';
import { api } from '@/utils/api-client';
import { getAxisLabel, getBusinessUnitName } from '@/utils/locale';

type MultilingualOption = {
  value: string;
  labelKey: string;
  fallbackLabel?: string;
};

export const useCostAggregationScenario = () => {
  const [businessUnits, setBusinessUnits] = useState<BusinessUnit[]>([]);
  const [options, setOptions] = useState<GetCostScenarioOptionsResponse | null>(null);
  const [concatTargets, setConcatTargets] = useState<GetConcatTargetsResponse['targets']>([]);
  const [parentConcatTargets, setParentConcatTargets] = useState<GetConcatTargetsResponse['targets']>([]);
  const [childConcatTargets, setChildConcatTargets] = useState<GetConcatTargetsResponse['targets']>([]);
  // 各buCdのオプションをキャッシュ（連結対象取得時に一括取得）
  const [buCdOptionsCache, setBuCdOptionsCache] = useState<Record<string, { salesVersions: SelectOption[]; costTypes: SelectOption[] }>>({});
  const lastAxisBuCdRef = useRef<string | null>(null);
  // fetchAllDataが実行済みかどうかを追跡（複数回実行を防ぐ）
  const fetchAllDataExecutedRef = useRef<boolean>(false);
  const { currentLanguage } = useLanguage();

  // 1回のAPI呼び出しで全データを取得
  const fetchAllData = async (): Promise<void> => {
    // 既に実行済みの場合はスキップ
    if (fetchAllDataExecutedRef.current) {
      console.log('fetchAllData: Already executed, skipping');
      return;
    }

    // 実行中フラグを設定（並行実行を防ぐ）
    if (fetchAllDataExecutedRef.current === false) {
      fetchAllDataExecutedRef.current = true;
    } else {
      console.log('fetchAllData: Already in progress, skipping');
      return;
    }

    try {
      console.log('fetchAllData: Starting fetch...');
      const res = await api.get<GetCostScenarioOptionsResponse>('cost-scenario/options').json();
      
      console.log('fetchAllData response:', {
        businessUnitsCount: res.businessUnits?.length || 0,
        axisOptionsCount: res.axisOptions?.length || 0,
        rateTypesCount: res.rateTypes?.length || 0,
        businessUnits: res.businessUnits,
      });
      
      // 全データを一度に設定
      // businessUnitsが存在する場合はそれを使用
      // 存在しない場合は、axisOptionsからbusinessUnitsを再構築
      if (res.businessUnits && res.businessUnits.length > 0) {
        setBusinessUnits(res.businessUnits);
      } else if (res.axisOptions && res.axisOptions.length > 0) {
        // axisOptionsからbusinessUnitsを再構築
        // 注意: axisOptionsにはbuCdしかないので、businessunitIdを取得する必要がある
        // 一時的に、axisOptionsのbuCdを使ってbusinessUnitsを構築
        // 実際のbusinessunitIdは後で取得する必要がある
        console.warn('businessUnits is not in API response, will fetch separately');
        // 別途businessUnitsを取得
        try {
          const units = await api.get<Array<BusinessUnit>>(BusinessUnitTransactions.RetrievingOfAll.URI_PATH).json();
          setBusinessUnits(units);
        } catch (error) {
          console.error('Failed to fetch business units separately:', error);
          setBusinessUnits([]);
        }
      } else {
        console.warn('businessUnits is empty or undefined in API response');
        setBusinessUnits([]);
      }
      setOptions(res);
    } catch (error) {
      console.error('Failed to fetch all data:', error);
      // エラー時は実行済みフラグをリセットしてリトライ可能にする
      fetchAllDataExecutedRef.current = false;
      // エラー時も既存の値を保持
    }
  };

  // 後方互換性のため残す（使用しない）
  const fetchBusinessUnit = async (): Promise<void> => {
    // fetchAllDataで取得済みなので何もしない
  };

  const fetchOptions = async () => {
    // fetchAllDataで取得済みなので何もしない
  };

  const fetchRateTypeOptions = async (): Promise<void> => {
    // fetchAllDataで取得済みなので何もしない
  };

  const fetchConcatTargets = async (
    axisBuCd: string,
    mode: 'parent' | 'child',
    signal?: AbortSignal
  ): Promise<void> => {
    console.log('fetchConcatTargets called:', { axisBuCd, mode });
    try {
      const res = await api
        .get<GetConcatTargetsResponse>('cost-scenario/concat-targets', { searchParams: { axisBuCd, mode }, signal })
        .json();
      console.log('fetchConcatTargets response:', res);

      // 中断されていたら以降の処理を行わない
      if (signal?.aborted) return;

      setConcatTargets([...res.targets]);
      if (mode === 'parent') {
        console.log('Setting parent targets:', res.targets);
        setParentConcatTargets([...res.targets]);
      }
      if (mode === 'child') {
        console.log('Setting child targets:', res.targets);
        setChildConcatTargets([...res.targets]);
      }

      // 連結対象の全てのbuCdのオプションを一括取得
      const buCdsToFetch = res.targets
        .map((target) => (mode === 'parent' ? target.parentBu.buCd : target.childBu.buCd))
        .filter((buCd): buCd is string => Boolean(buCd && buCd.trim() !== ''))
        .filter((buCd) => !buCdOptionsCache[buCd]); // 既にキャッシュされているものは除外

      if (buCdsToFetch.length > 0) {
        console.log('Fetching options for buCds:', buCdsToFetch);
        // バッチサイズを制限（一度に3つまで）
        const batchSize = 3;
        const newCache: Record<string, { salesVersions: SelectOption[]; costTypes: SelectOption[] }> = {};
        
        for (let i = 0; i < buCdsToFetch.length; i += batchSize) {
          if (signal?.aborted) break;
          
          const batch = buCdsToFetch.slice(i, i + batchSize);
          
          await Promise.all(
            batch.map(async (buCd) => {
              if (signal?.aborted) return;
              
              try {
                const res = await api
                  .get<AxisDependentOptionsResponse>('cost-scenario/axis-options', {
                    searchParams: { buCd },
                    signal,
                  })
                  .json();
                
                if (!signal?.aborted) {
                  newCache[buCd] = {
                    salesVersions: (res.salesVersions ?? []).map((sv) => ({ value: sv.id, label: sv.name })),
                    costTypes: (res.costVersions ?? []).map((cv) => ({ value: cv.id, label: cv.name })),
                  };
                  console.log(`Cached options for buCd ${buCd}:`, { salesVersions: newCache[buCd].salesVersions.length, costTypes: newCache[buCd].costTypes.length });
                }
              } catch (error) {
                console.error(`Failed to fetch options for buCd ${buCd}:`, error);
                // エラー時は空のオプションをキャッシュ（リトライしない）
                if (!signal?.aborted) {
                  newCache[buCd] = { salesVersions: [], costTypes: [] };
                }
              }
            })
          );
        }
        
        if (!signal?.aborted && Object.keys(newCache).length > 0) {
          setBuCdOptionsCache((prev) => ({ ...prev, ...newCache }));
        }
      }
    } catch (error: unknown) {
      // AbortError の場合は握りつぶす
      if (error && typeof error === 'object' && 'name' in error && (error as any).name === 'AbortError') {
        console.log('fetchConcatTargets aborted:', { axisBuCd, mode });
        return;
      }
      throw error;
    }
  };

  const clearConcatTargets = () => setConcatTargets([]);
  const clearParentConcatTargets = () => setParentConcatTargets([]);
  const clearChildConcatTargets = () => setChildConcatTargets([]);

  // 軸依存のオプションを取得する（将来のエンドポイント想定）。現状はno-op。
  const fetchAxisDependentOptions = useCallback(async (_axisBuCd: string) => {
    console.log('fetchAxisDependentOptions called with buCd:', _axisBuCd);
    
    if (lastAxisBuCdRef.current === _axisBuCd) {
      console.log(`fetchAxisDependentOptions: axis buCd ${_axisBuCd} already loaded, skipping`);
      return;
    }
    
    try {
      const res = await api
        .get<AxisDependentOptionsResponse>('cost-scenario/axis-options', {
          searchParams: { buCd: _axisBuCd },
        })
        .json();

      console.log('fetchAxisDependentOptions response:', {
        buCd: _axisBuCd,
        salesVersionsCount: res.salesVersions?.length || 0,
        costVersionsCount: res.costVersions?.length || 0,
      });

      // 集計軸のオプションもキャッシュに保存
      setBuCdOptionsCache((prev) => {
        const newEntry = {
          salesVersions: (res.salesVersions ?? []).map((sv) => ({ value: sv.id, label: sv.name })),
          costTypes: (res.costVersions ?? []).map((cv) => ({ value: cv.id, label: cv.name })),
        };
        
        const updated = {
          ...prev,
          [_axisBuCd]: newEntry,
        };
        console.log('Updated buCdOptionsCache keys:', Object.keys(updated));
        console.log(`Cached options for axis buCd ${_axisBuCd}:`, {
          salesVersions: newEntry.salesVersions.length,
          costTypes: newEntry.costTypes.length,
        });
        // 新しいオブジェクトを返すことで、参照を確実に変更
        return updated;
      });

      // optionsも更新
      lastAxisBuCdRef.current = _axisBuCd;
      setOptions((prev) =>
        prev
          ? {
              ...prev,
              // セレクターには通常の事業名と「ALL」を表示（「ALL」は1件だけ）
              scenarioBusinesses: res.scenarioBusinesses.map((s: any) => ({ id: s.id, name: s.nameJa })),
              costVersions: res.costVersions.map((c: any) => ({ id: c.id, name: c.name })),
              businessUnits: prev.businessUnits, // 既存のbusinessUnitsを保持
            }
          : {
              axisOptions: [],
              scenarioTypes: [],
              rateTypes: [],
              currencies: [],
              salesVersions: [],
              // セレクターには通常の事業名と「ALL」を表示（「ALL」は1件だけ）
              scenarioBusinesses: res.scenarioBusinesses.map((s: any) => ({ id: s.id, name: s.nameJa })),
              costVersions: res.costVersions.map((c: any) => ({ id: c.id, name: c.name })),
              businessUnits: [], // 初期値として空配列
            }
      );
    } catch (error) {
      console.error('Failed to fetch axis dependent options for buCd:', _axisBuCd, error);
      // エラー時は空のオプションをキャッシュ（リトライしない）
      setBuCdOptionsCache((prev) => ({
        ...prev,
        [_axisBuCd]: { salesVersions: [], costTypes: [] },
      }));
    }
  }, []); // 依存関係を空にして、関数を安定させる

  useEffect(() => {
    // 1回のAPI呼び出しで全データを取得（実行済みフラグで重複実行を防ぐ）
    if (!fetchAllDataExecutedRef.current) {
      fetchAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 依存配列を空にして、マウント時に1回だけ実行

  // 多言語対応の選択肢を生成する関数
  const getClassificationOptions = (): MultilingualOption[] => [
    { value: String(AggClass.PLAN), labelKey: 'options.classification.plan', fallbackLabel: '計画' },
    { value: String(AggClass.ACTUAL), labelKey: 'options.classification.actual', fallbackLabel: '実績' },
    { value: String(AggClass.FORECAST), labelKey: 'options.classification.forecast', fallbackLabel: '見通し' },
  ];

  const getMonthOptions = (): MultilingualOption[] => {
    return Array.from({ length: 12 }, (_, i) => ({
      value: String(i + 1),
      labelKey: `options.month.${i + 1}`,
      fallbackLabel: `${i + 1}月`,
    }));
  };

  // APIから取得したオプションをUI向けの配列に変換
  const getScenarioTypeOptions = (): { value: string; label: string }[] => {
    const scenarioTypes: ScenarioTypeOption[] = options?.scenarioTypes ?? [];
    return scenarioTypes.map((s: ScenarioTypeOption) => ({ value: s.id, label: s.name }));
  };

  const getCurrencyOptions = (): { value: string; label: string }[] => {
    return (options?.currencies ?? []).map((c) => ({ value: c.value, label: c.label }));
  };

  const getRateTypeOptions = (): { value: string; label: string }[] => {
    return (options?.rateTypes ?? []).map((r) => ({ value: String(r.value), label: r.label }));
  };

  const getAxisOptions = (): { value: string; label: string }[] => {
    return (options?.axisOptions ?? []).map((a: AxisOption) => ({
      value: a.buCd,
      label: getAxisLabel(a, currentLanguage),
    }));
  };

  const getBusinessOptions = (): { value: string; label: string }[] => {
    return (options?.scenarioBusinesses ?? []).map((b: ScenarioBusinessOption) => ({ value: b.id, label: b.name }));
  };

  // 事業単位の多言語対応ラベルを取得
  const getBusinessUnitLabel = (businessUnit: BusinessUnit): string =>
    getBusinessUnitName(businessUnit, currentLanguage);

  // テーブルデータを生成する関数
  const generateTableData = useCallback(
    (
      aggregationAxis: string,
      parentTargets: GetConcatTargetsResponse['targets'],
      childTargets: GetConcatTargetsResponse['targets'],
      parentChecked: boolean,
      childChecked: boolean
    ): TableRowData[] => {
      console.log('generateTableData called with:', {
        aggregationAxis,
        parentTargetsLength: parentTargets.length,
        childTargetsLength: childTargets.length,
        parentChecked,
        childChecked,
      });
      const tableData: TableRowData[] = [];

      // 集計軸が選択されている場合、先頭行に集計軸を追加
      // aggregationAxisはbusinessunitIdなので、businessUnitsから検索してラベルを生成
      if (aggregationAxis) {
        const selectedBu = businessUnits.find((bu) => bu.businessunitId === aggregationAxis);
        let axisLabel: string;
        
        if (selectedBu) {
          // 他の画面と同じ表示名生成ロジック
          const joinSpace = (a?: string, b?: string) => [a, b].filter((x) => Boolean(x && x.trim())).join(' ');
          const buJa = selectedBu.businessunitNameJa ?? selectedBu.name ?? '';
          const buEn = selectedBu.businessunitNameEn ?? buJa;
          const prodJa = selectedBu.productNameJa ?? '';
          const prodEn = selectedBu.productNameEn ?? '';
          
          switch (currentLanguage) {
            case 'ja':
              axisLabel = joinSpace(buJa, prodJa);
              break;
            case 'en':
              axisLabel = joinSpace(buEn, prodEn);
              break;
            default:
              axisLabel = joinSpace(buJa || buEn, prodJa || prodEn || selectedBu.productNameZh);
              break;
          }
        } else {
          axisLabel = aggregationAxis; // フォールバック
        }

        tableData.push({
          base: axisLabel,
          classification: '集計軸',
          salesVersion: '',
          costType: '',
          buCd: selectedBu?.buCd || '', // buCdも保存
          shKb: selectedBu?.shKb ?? null,
          rowType: 'axis',
        });
      }

      // 親が選択されている場合、親の連結対象を追加
      if (parentChecked && parentTargets.length > 0) {
        console.log('Adding parent targets:', parentTargets);
        parentTargets.forEach((target) => {
          tableData.push({
            base: getBusinessUnitLabel(target.parentBu),
            classification: '親',
            salesVersion: '',
            costType: '',
            buCd: target.parentBu.buCd,
            aggConcatId: target.aggConcatId,
            shKb: target.parentBu.shKb ?? null,
            rowType: 'parent',
          });
        });
      }

      // 子が選択されている場合、子の連結対象を追加
      if (childChecked && childTargets.length > 0) {
        console.log('Adding child targets:', childTargets);
        childTargets.forEach((target) => {
          tableData.push({
            base: getBusinessUnitLabel(target.childBu),
            classification: '子',
            salesVersion: '',
            costType: '',
            buCd: target.childBu.buCd,
            aggConcatId: target.aggConcatId,
            shKb: target.childBu.shKb ?? null,
            rowType: 'child',
          });
        });
      }

      return tableData;
    },
    [businessUnits, currentLanguage]
  );

  // 原価種類オプションを取得
  const getCostTypeOptions = useCallback((): SelectOption[] => {
    return (options?.costVersions ?? []).map((cv) => ({ value: cv.id, label: cv.name }));
  }, [options?.costVersions]);

  // 販売バージョンオプションを取得（現在は空配列、後で実装）
  const getSalesVersionOptions = useCallback((): SelectOption[] => {
    return (options?.salesVersions ?? []).map((sv) => ({ value: sv.id, label: sv.name }));
  }, [options?.salesVersions]);

  // 指定されたbuCdに紐づく原価バージョンオプションを取得（キャッシュから）
  const getCostTypeOptionsForBuCd = useCallback(
    async (buCd: string): Promise<SelectOption[]> => {
      if (!buCd || buCd.trim() === '') {
        return [];
      }

      // キャッシュから取得
      if (buCdOptionsCache[buCd]) {
        return buCdOptionsCache[buCd].costTypes;
      }

      // キャッシュにない場合は取得（フォールバック）
      console.warn(`Options for buCd ${buCd} not in cache, fetching...`);
      try {
        const res = await api
          .get<AxisDependentOptionsResponse>('cost-scenario/axis-options', {
            searchParams: { buCd },
          })
          .json();

        const costTypes = (res.costVersions ?? []).map((cv) => ({ value: cv.id, label: cv.name }));
        
        // キャッシュに保存
        setBuCdOptionsCache((prev) => ({
          ...prev,
          [buCd]: {
            salesVersions: (res.salesVersions ?? []).map((sv) => ({ value: sv.id, label: sv.name })),
            costTypes,
          },
        }));
        
        return costTypes;
      } catch (error) {
        console.error('Failed to fetch cost versions for buCd:', buCd, error);
        return [];
      }
    },
    [buCdOptionsCache]
  );

  // 指定されたbuCdに紐づく販売バージョンオプションを取得（キャッシュから）
  const getSalesVersionOptionsForBuCd = useCallback(
    async (buCd: string): Promise<SelectOption[]> => {
      if (!buCd || buCd.trim() === '') {
        return [];
      }

      // キャッシュから取得
      if (buCdOptionsCache[buCd]) {
        return buCdOptionsCache[buCd].salesVersions;
      }

      // キャッシュにない場合は取得（フォールバック）
      console.warn(`Options for buCd ${buCd} not in cache, fetching...`);
      try {
        const res = await api
          .get<AxisDependentOptionsResponse>('cost-scenario/axis-options', {
            searchParams: { buCd },
          })
          .json();

        const salesVersions = (res.salesVersions ?? []).map((sv) => ({ value: sv.id, label: sv.name }));
        
        // キャッシュに保存
        setBuCdOptionsCache((prev) => ({
          ...prev,
          [buCd]: {
            salesVersions,
            costTypes: (res.costVersions ?? []).map((cv) => ({ value: cv.id, label: cv.name })),
          },
        }));
        
        return salesVersions;
      } catch (error) {
        console.error('Failed to fetch sales versions for buCd:', buCd, error);
        return [];
      }
    },
    [buCdOptionsCache]
  );

  return {
    fetchBusinessUnit,
    fetchOptions,
    fetchRateTypeOptions,
    fetchConcatTargets,
    clearConcatTargets,
    clearParentConcatTargets,
    clearChildConcatTargets,
    fetchAxisDependentOptions,
    businessUnits,
    options,
    concatTargets,
    parentConcatTargets,
    childConcatTargets,
    buCdOptionsCache,
    currentLanguage,
    getClassificationOptions,
    getMonthOptions,
    getScenarioTypeOptions,
    getCurrencyOptions,
    getRateTypeOptions,
    getAxisOptions,
    getBusinessOptions,
    getBusinessUnitLabel,
    generateTableData,
    getCostTypeOptions,
    getSalesVersionOptions,
    getCostTypeOptionsForBuCd,
    getSalesVersionOptionsForBuCd,
  };
};
