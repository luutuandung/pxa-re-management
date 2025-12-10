import {
  AggClass,
  type AxisDependentOptionsResponse,
  type AxisOption,
  type BusinessUnitItem,
  type GetBusinessUnitListResponse,
  type GetConcatTargetsResponse,
  type GetCostScenarioOptionsResponse,
  type ScenarioBusinessOption,
  type ScenarioTypeOption,
  type SelectOption,
  type TableRowData,
} from '@pxa-re-management/shared';
import { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/store/languageSettings';
import { api } from '@/utils/api-client';
import { getAxisLabel, getBusinessUnitName } from '@/utils/locale';

type MultilingualOption = {
  value: string;
  labelKey: string;
  fallbackLabel?: string;
};

export const useCostAggregationScenario = () => {
  const [businessUnits, setBusinessUnits] = useState<BusinessUnitItem[]>([]);
  const [options, setOptions] = useState<GetCostScenarioOptionsResponse | null>(null);
  const [concatTargets, setConcatTargets] = useState<GetConcatTargetsResponse['targets']>([]);
  const [parentConcatTargets, setParentConcatTargets] = useState<GetConcatTargetsResponse['targets']>([]);
  const [childConcatTargets, setChildConcatTargets] = useState<GetConcatTargetsResponse['targets']>([]);
  const [rateTypeOptions, setRateTypeOptions] = useState<SelectOption[]>([]);
  const { currentLanguage } = useLanguage();

  const fetchBusinessUnit = async () => {
    const response = await api.get<GetBusinessUnitListResponse>('business-unit').json();
    setBusinessUnits(response.businessUnits);
  };

  const fetchOptions = async () => {
    const res = await api.get<GetCostScenarioOptionsResponse>('cost-scenario/options').json();
    setOptions(res);
  };

  const fetchRateTypeOptions = async (): Promise<void> => {
    const res = await api.get<SelectOption[]>('cost-scenario/rate-type-options').json();
    setRateTypeOptions(res);
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
  const fetchAxisDependentOptions = async (_axisBuCd: string) => {
    console.log('fetchAxisDependentOptions', _axisBuCd);
    const res = await api
      .get<AxisDependentOptionsResponse>('cost-scenario/axis-options', {
        searchParams: { buCd: _axisBuCd },
      })
      .json();

    setOptions((prev) =>
      prev
        ? {
            ...prev,
            scenarioBusinesses: res.scenarioBusinesses.map((s) => ({ id: s.id, name: s.nameJa })),
            costVersions: res.costVersions.map((c) => ({ id: c.id, name: c.name })),
          }
        : {
            axisOptions: [],
            scenarioTypes: [],
            rateTypes: [],
            salesVersions: [],
            scenarioBusinesses: res.scenarioBusinesses.map((s) => ({ id: s.id, name: s.nameJa })),
            costVersions: res.costVersions.map((c) => ({ id: c.id, name: c.name })),
          }
    );
  };

  useEffect(() => {
    fetchBusinessUnit();
    fetchOptions();
    fetchRateTypeOptions();
  }, []);

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
    return (options?.scenarioTypes ?? []).map((s: ScenarioTypeOption) => ({ value: s.id, label: s.name }));
  };

  const getCurrencyOptions = (): { value: string; label: string }[] => {
    return rateTypeOptions.map((r) => ({ value: r.value, label: r.label }));
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
  const getBusinessUnitLabel = (businessUnit: BusinessUnitItem): string =>
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
      if (aggregationAxis) {
        const axisOption = options?.axisOptions.find((opt) => opt.buCd === aggregationAxis);
        const axisLabel = axisOption
          ? currentLanguage === 'ja'
            ? axisOption.nameJa
            : currentLanguage === 'en'
              ? axisOption.nameEn
              : axisOption.nameZh
          : aggregationAxis;

        tableData.push({
          base: axisLabel,
          classification: '集計軸',
          salesVersion: '',
          costType: '',
          buCd: aggregationAxis,
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
            rowType: 'child',
          });
        });
      }

      return tableData;
    },
    [options, currentLanguage]
  );

  // 原価種類オプションを取得
  const getCostTypeOptions = useCallback((): SelectOption[] => {
    return (options?.costVersions ?? []).map((cv) => ({ value: cv.id, label: cv.name }));
  }, [options?.costVersions]);

  // 販売バージョンオプションを取得（現在は空配列、後で実装）
  const getSalesVersionOptions = useCallback((): SelectOption[] => {
    return (options?.salesVersions ?? []).map((sv) => ({ value: sv.id, label: sv.name }));
  }, [options?.salesVersions]);

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
    currentLanguage,
    getClassificationOptions,
    getMonthOptions,
    getScenarioTypeOptions,
    getCurrencyOptions,
    getAxisOptions,
    getBusinessOptions,
    getBusinessUnitLabel,
    generateTableData,
    getCostTypeOptions,
    getSalesVersionOptions,
  };
};
