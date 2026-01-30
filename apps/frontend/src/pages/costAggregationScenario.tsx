import type { Scenario, TableRowData } from '@pxa-re-management/shared';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup';
import SearchConditionForm from '@/components/molecules/SearchConditionForm';
import CostAggregationTable from '@/components/organisms/CostAggregationTable';
import { useCostAggregationScenario } from '@/hooks/useCostAggregationScenario';
import { useLanguageSelectors } from '@/store/languageSettings';
import { useStickyMessageActions } from '@/store/stickyMessage';
import { api } from '@/utils/api-client';
import { joinBaseAndProduct } from '@/utils/locale';

const CostAggregationScenario: React.FC = () => {
  const { t } = useTranslation('costAggregationScenario');
  const {
    generateTableData,
    getCurrencyOptions,
    getRateTypeOptions,
    getBusinessOptions,
    getClassificationOptions,
    fetchAxisDependentOptions,
    fetchConcatTargets,
    clearConcatTargets,
    clearParentConcatTargets,
    clearChildConcatTargets,
    parentConcatTargets,
    childConcatTargets,
    businessUnits,
    buCdOptionsCache,
  } = useCostAggregationScenario();
  const { currentLanguage } = useLanguageSelectors();
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();

  // フォームの状態管理
  const [formData, setFormData] = useState({
    scenarioName: '', // シナリオ名
    applicationStartDate: '', // 適用開始 YYYY-MM形式
    applicationEndDate: '', // 適用終了 YYYY-MM形式
    aggregationBusiness: '',
    aggregationAxis: '',
    aggregationCurrency: '',
    rateType: '',
    childTarget: false,
    parentTarget: false,
    description: '', // 説明
    // 以下は内部で使用（非表示）
    classification: '',
    scenarioType: '',
  });

  // 行ごとのユーザー入力上書き（salesVersion, costType）
  const [rowOverrides, setRowOverrides] = useState<Record<string, { salesVersion?: string; costType?: string }>>({});
  const [modelNames, setModelNames] = useState<string[]>([]);

  // フォームデータの変更ハンドラー
  const handleFormDataChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const scenarioBusinessId = formData.aggregationBusiness;
    if (!scenarioBusinessId || scenarioBusinessId === 'ALL') {
      setModelNames([]);
      return;
    }

    let cancelled = false;
    api
      .get<{ modelNames: string[] }>('cost-scenario/business-models', { searchParams: { scenarioBusinessId } })
      .json()
      .then((res) => {
        if (!cancelled) {
          setModelNames(res.modelNames ?? []);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch model names:', error);
        if (!cancelled) {
          setModelNames([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [formData.aggregationBusiness]);

  // 派生テーブルデータ（現在のフォーム状態と取得済みターゲットから生成し、必要に応じてユーザーの入力を合成）
  const baseTableData: TableRowData[] = useMemo(
    () =>
      generateTableData(
        formData.aggregationAxis,
        parentConcatTargets,
        childConcatTargets,
        formData.parentTarget,
        formData.childTarget
      ),
    [
      formData.aggregationAxis,
      formData.parentTarget,
      formData.childTarget,
      parentConcatTargets,
      childConcatTargets,
      generateTableData,
    ]
  );

  const tableData: TableRowData[] = useMemo(() => {
    return baseTableData.map((row) => {
      const key = `${row.rowType}-${row.buCd ?? ''}-${row.aggConcatId ?? ''}`;
      const override = rowOverrides[key];
      return override ? { ...row, ...override } : row;
    });
  }, [baseTableData, rowOverrides]);

  // 販売/原価バージョンのデフォルト値を1件目に設定
  useEffect(() => {
    if (baseTableData.length === 0) return;

    let changed = false;
    setRowOverrides((prev) => {
      const next = { ...prev };
      baseTableData.forEach((row) => {
        if (!row.buCd) return;
        const key = `${row.rowType}-${row.buCd ?? ''}-${row.aggConcatId ?? ''}`;
        const current = next[key] ?? {};
        const options = buCdOptionsCache[row.buCd];
        if (!options) return;

        const defaultSales = options.salesVersions[0]?.value;
        const defaultCost = options.costTypes[0]?.value;

        if (!current.salesVersion && defaultSales) {
          next[key] = { ...current, salesVersion: defaultSales };
          changed = true;
        }
        if (!current.costType && defaultCost) {
          next[key] = { ...next[key], costType: defaultCost };
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [baseTableData, buCdOptionsCache]);

  // ユーザーがテーブル上で値を変更した際に上書きを記録
  const handleTableDataChange = (index: number, field: 'salesVersion' | 'costType', value: string) => {
    const row = tableData[index];
    if (!row) return;
    const key = `${row.rowType}-${row.buCd ?? ''}-${row.aggConcatId ?? ''}`;
    setRowOverrides((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };


  // 集計軸が変わったら、既存の行上書きは一旦リセット（キーが変わるため）
  // 子/親フラグや取得結果の変化に応じては自然に再合成される
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _axisForReset = formData.aggregationAxis;
  useMemo(() => {
    setRowOverrides({});
    return undefined;
  }, [_axisForReset]);

  const handleApply = () => {
    // SCENARIOS は固定キー。現在は単一集計軸前提なので行の BU を SCENARIO_DETAILS に落とし込む
    // AGG_CYCLE: 区分（AggClass）をそのまま
    // TARGET_BU_CD: 集計軸（フォームの aggregationAxis）
    // 選択された事業が「ALL」の場合はそのまま「ALL」を使用、それ以外は選択されたIDを使用
    const scenarioBusinessId = formData.aggregationBusiness || 'ALL';

    // SCENARIO_DETAILS: テーブルの親/子行を AGG_SEQUENCE 順に詰める（ここでは1からの連番）
    const axisBuCd =
      businessUnits.find((b) => b.businessunitId === formData.aggregationAxis)?.buCd ||
      formData.aggregationAxis ||
      '';

    const scenarios = [
      {
        AGG_CYCLE: formData.classification || '',
        TARGET_BU_CD: axisBuCd,
        SCENARIO_BUSINESS_ID: scenarioBusinessId,
        SCENARIO_DETAILS: tableData
          .filter((r) => r.rowType === 'parent' || r.rowType === 'child' || r.rowType === 'axis')
          .map((r, idx) => {
            const normalizedBuCd = (r.buCd ?? '').trim();
            const bu = businessUnits.find((b) => (b.buCd ?? '').trim() === normalizedBuCd);
            const buNameCombined = joinBaseAndProduct(r.base, bu, currentLanguage);
            const costOptions = r.buCd ? buCdOptionsCache[r.buCd]?.costTypes ?? [] : [];
            const costLabel = costOptions.find((o) => o.value === r.costType)?.label;
            const costVer = costLabel || r.costType || (buNameCombined ? `${buNameCombined}_TEST` : '');
            const shKbFromTargets =
              r.rowType === 'parent'
                ? parentConcatTargets.find((t) => t.aggConcatId === r.aggConcatId)?.parentBu.shKb
                : r.rowType === 'child'
                  ? childConcatTargets.find((t) => t.aggConcatId === r.aggConcatId)?.childBu.shKb
                  : undefined;
            const shKbValue = r.shKb ?? bu?.shKb ?? shKbFromTargets ?? '';
            const shKb = shKbValue !== null && shKbValue !== undefined ? String(shKbValue) : '';
            
            return {
              AGG_SEQUENCE: String(idx + 1),
              BU_CD: r.buCd ?? '',
              BU_NAME: buNameCombined,
              SH_KB: shKb,
              HBI_VER: `${buNameCombined}_2024年度_実績TEST`,
              COST_VER: costVer,
              RATE_TYPE: '1',
            };
          }),
      },
    ];

    // TARGET_DATES: 集計開始月と集計終了月から生成
    // applicationStartDateとapplicationEndDateはYYYY-MM形式
    const targetDates: string[] = [];
    if (formData.applicationStartDate && formData.applicationEndDate) {
      const [startYear, startMonth] = formData.applicationStartDate.split('-').map(Number);
      const [endYear, endMonth] = formData.applicationEndDate.split('-').map(Number);
      const start = new Date(startYear, startMonth - 1, 1);
      const end = new Date(endYear, endMonth - 1, 1);
      const current = new Date(start);
      while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        targetDates.push(`${year}${month}`);
        current.setMonth(current.getMonth() + 1);
      }
    } else if (formData.applicationStartDate) {
      const [yearStr, monthStr] = formData.applicationStartDate.split('-');
      if (yearStr && monthStr) {
        targetDates.push(`${yearStr}${monthStr}`);
      }
    }

    const targetItems = modelNames.length > 0 ? modelNames : ['ALL'];
    const targetAggType = formData.parentTarget || formData.childTarget ? 'concat' : 'single';
    const payload = {
      SCENARIOS: scenarios,
      TARGET_DATES: targetDates,
      TARGET_ITEMS: targetItems,
      AGG_SCENARIO_VER: formData.scenarioName || 'JSON検証',
      TARGET_CUR_CD: formData.aggregationCurrency || 'JPY',
      TARGET_LANGUAGE: currentLanguage?.toUpperCase() || 'JA',
      TARGET_AGG_TYPE: targetAggType,
    } as const;

    console.log('Apply payload', JSON.stringify(payload, null, 2));
  };

  const downloadJSON = (data: unknown, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const createPayload = () => {
    const axisRow = tableData.find((r) => r.rowType === 'axis');
    const axisBuCd =
      axisRow?.buCd ||
      businessUnits.find((b) => b.businessunitId === formData.aggregationAxis)?.buCd ||
      '';

    const scenarioDetailsRows = tableData.filter(
      (r) => r.rowType === 'parent' || r.rowType === 'child' || r.rowType === 'axis'
    );

    // 選択された事業が「ALL」の場合はそのまま「ALL」を使用、それ以外は選択されたIDを使用
    const scenarioBusinessId = formData.aggregationBusiness || 'ALL';

    const scenarios: Scenario[] = [
      {
        aggCycle: formData.classification || '',
        targetBuCd: axisBuCd,
        scenarioBusinessId: scenarioBusinessId,
        scenarioDetails: scenarioDetailsRows.map((r, idx) => {
          const normalizedBuCd = (r.buCd ?? '').trim();
          const bu = businessUnits.find((b) => (b.buCd ?? '').trim() === normalizedBuCd);
          let buNameCombined: string;
          if (r.rowType === 'axis') {
            buNameCombined = r.base || '';
          } else {
            buNameCombined = joinBaseAndProduct(r.base, bu, currentLanguage);
          }

          buNameCombined = buNameCombined.replace(/\s+/g, '_');

          const costOptions = r.buCd ? buCdOptionsCache[r.buCd]?.costTypes ?? [] : [];
          const costLabel = costOptions.find((o) => o.value === r.costType)?.label;
          const costVer = costLabel || r.costType || (buNameCombined ? `${buNameCombined}_TEST` : '');
          const shKbFromTargets =
            r.rowType === 'parent'
              ? parentConcatTargets.find((t) => t.aggConcatId === r.aggConcatId)?.parentBu.shKb
              : r.rowType === 'child'
                ? childConcatTargets.find((t) => t.aggConcatId === r.aggConcatId)?.childBu.shKb
                : undefined;
          const shKbValue = r.shKb ?? bu?.shKb ?? shKbFromTargets ?? '';
          const shKb = shKbValue !== null && shKbValue !== undefined ? String(shKbValue) : '';

          return {
            aggSequence: String(idx + 1),
            aggCycle: String(idx + 1),
            buCd: r.buCd ?? '',
            buName: buNameCombined,
            shKb,
            gnkKb: formData.classification || '',
            hbiVer: r.salesVersion || `${buNameCombined}_2024年度_実績TEST`,
            costVer: costVer,
            rateType: formData.rateType || '',
          };
        }),
      },
    ];

    // TARGET_DATES: 集計開始月と集計終了月から生成
    // applicationStartDateとapplicationEndDateはYYYY-MM形式
    const targetDates: string[] = [];
    if (formData.applicationStartDate && formData.applicationEndDate) {
      const [startYear, startMonth] = formData.applicationStartDate.split('-').map(Number);
      const [endYear, endMonth] = formData.applicationEndDate.split('-').map(Number);
      const start = new Date(startYear, startMonth - 1, 1);
      const end = new Date(endYear, endMonth - 1, 1);
      const current = new Date(start);
      while (current <= end) {
        const year = current.getFullYear();
        const month = String(current.getMonth() + 1).padStart(2, '0');
        targetDates.push(`${year}${month}`);
        current.setMonth(current.getMonth() + 1);
      }
    } else if (formData.applicationStartDate) {
      const [yearStr, monthStr] = formData.applicationStartDate.split('-');
      if (yearStr && monthStr) {
        targetDates.push(`${yearStr}${monthStr}`);
      }
    }

    // Transform to UPPER_CASE format for external API
    const transformToUpperCase = (scenario: Scenario): {
      SCENARIO_DETAILS: Array<{
        AGG_SEQUENCE: string;
        BU_CD: string;
        BU_NAME: string;
        SH_KB: string;
        GNK_KB: string;
        HBI_VER: string;
        COST_VER: string;
        RATE_TYPE: string;
        AGG_CYCLE: string;
        TARGET_BU_CD: string;
      }>;
    } => ({
      SCENARIO_DETAILS: scenario.scenarioDetails.map((detail) => ({
        AGG_SEQUENCE: detail.aggSequence,
        BU_CD: detail.buCd,
        BU_NAME: detail.buName,
        SH_KB: detail.shKb,
        GNK_KB: detail.gnkKb,
        HBI_VER: detail.hbiVer,
        COST_VER: detail.costVer,
        RATE_TYPE: detail.rateType,
        AGG_CYCLE: detail.aggCycle,
        TARGET_BU_CD: scenario.targetBuCd,
      })),
    });

    // AGG_SCENARIO_VER: シナリオ名をそのまま使用
    const aggScenarioVer = formData.scenarioName || 'JSON検証';

    const targetItems = modelNames.length > 0 ? modelNames : ['ALL'];
    const targetAggType = formData.parentTarget || formData.childTarget ? 'concat' : 'single';
    return {
      SCENARIOS: scenarios.map(transformToUpperCase),
      TARGET_DATES: targetDates,
      TARGET_ITEMS: targetItems,
      AGG_SCENARIO_VER: aggScenarioVer,
      TARGET_CUR_CD: formData.aggregationCurrency || 'JPY',
      TARGET_LANGUAGE: currentLanguage?.toUpperCase() || 'JA',
      TARGET_AGG_TYPE: targetAggType,
    };
  };

  const handleExecute = async () => {
    // シナリオ名のバリデーション
    if (!formData.scenarioName || formData.scenarioName.trim() === '') {
      addErrorMessage(t('messages.noScenarioName') || 'シナリオ名を入力してください');
      return;
    }

    const axisRow = tableData.find((r) => r.rowType === 'axis');
    const axisBuCd =
      axisRow?.buCd ||
      businessUnits.find((b) => b.businessunitId === formData.aggregationAxis)?.buCd ||
      '';
    const scenarioDetailsRows = tableData.filter((r) => r.rowType === 'parent' || r.rowType === 'child');
    const hasAxisRow = tableData.some((r) => r.rowType === 'axis');

    if (!axisBuCd && !hasAxisRow) {
      addErrorMessage(t('messages.noAggregationAxis'));
      return;
    }

    if (scenarioDetailsRows.length === 0 && !hasAxisRow) {
      addErrorMessage(t('messages.noScenarioDetails'));
      return;
    }

    const hasMissingVersions = tableData.some((row) => !row.salesVersion || !row.costType);
    if (hasMissingVersions) {
      addErrorMessage('販売バージョンまたは原価バージョンが未選択の行があります。');
      return;
    }

    const payload = createPayload();
    // ファイル名を自動生成（Aggregation Axisの名前を使用）
    let axisName = '';
    if (axisRow) {
      axisName = axisRow.base || '';
    } else if (axisBuCd) {
      const axisBu = businessUnits.find((b) => b.buCd === axisBuCd);
      if (axisBu) {
        axisName = joinBaseAndProduct('', axisBu, currentLanguage);
      }
    }
    // スペースをアンダースコアに置換し、ファイル名として使用
    const fileBaseName = axisName.replace(/\s+/g, '_') || 'UNKNOWN';
    const finalFilename = `param_${fileBaseName}.json`;

    try {
      const uploadResponse = await api
        .post('cost-scenario/upload', {
          json: {
            payload,
            filename: finalFilename,
          },
        })
        .json<{ success: boolean; url: string; filename: string }>();

      if (uploadResponse.success) {
        addSuccessMessage(t('messages.uploadSuccess'));
      }
    } catch (error) {
      console.error('Failed to upload to Azure Blob Storage:', error);
      addErrorMessage(t('messages.uploadError'));
      downloadJSON(payload, finalFilename);
    }
  };

  const handleCancel = () => {
    console.log('Cancel clicked');
  };

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="px-6 ">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('title')}</h1>
            <div className="h-0.5 bg-blue-600 w-full"></div>
          </div>

          <SearchConditionForm
            formData={formData}
            onFormDataChange={handleFormDataChange}
            fetchConcatTargets={fetchConcatTargets}
            businessUnits={businessUnits}
            getCurrencyOptions={getCurrencyOptions}
            getRateTypeOptions={getRateTypeOptions}
            getBusinessOptions={getBusinessOptions}
        getClassificationOptions={getClassificationOptions}
            fetchAxisDependentOptions={fetchAxisDependentOptions}
            clearConcatTargets={clearConcatTargets}
            clearParentConcatTargets={clearParentConcatTargets}
            clearChildConcatTargets={clearChildConcatTargets}
          />

          <CostAggregationTable
            data={tableData}
            buCdOptionsCache={buCdOptionsCache}
            onSalesVersionChange={(index, value) => handleTableDataChange(index, 'salesVersion', value)}
            onCostTypeChange={(index, value) => handleTableDataChange(index, 'costType', value)}
          />

          <ActionButtonGroup onApply={handleApply} onExecute={handleExecute} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default CostAggregationScenario;
