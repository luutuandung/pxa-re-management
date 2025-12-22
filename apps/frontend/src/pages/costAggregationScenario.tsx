import type { Scenario, TableRowData } from '@pxa-re-management/shared';
import type React from 'react';
import { useMemo, useState } from 'react';
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
    getCostTypeOptions,
    getSalesVersionOptions,
    fetchConcatTargets,
    parentConcatTargets,
    childConcatTargets,
    businessUnits,
  } = useCostAggregationScenario();
  const { currentLanguage } = useLanguageSelectors();
  const { addSuccessMessage, addErrorMessage } = useStickyMessageActions();

  // フォームの状態管理
  const [formData, setFormData] = useState({
    classification: '',
    aggregationMonth: '',
    thereafter: false,
    scenarioType: '',
    aggregationCurrency: '',
    aggregationAxis: '',
    childTarget: false,
    parentTarget: false,
    aggregationBusiness: '',
  });

  // 行ごとのユーザー入力上書き（salesVersion, costType）
  const [rowOverrides, setRowOverrides] = useState<Record<string, { salesVersion?: string; costType?: string }>>({});

  // フォームデータの変更ハンドラー
  const handleFormDataChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 派生テーブルデータ（現在のフォーム状態と取得済みターゲットから生成し、必要に応じてユーザーの入力を合成）
  const tableData: TableRowData[] = useMemo(() => {
    const base = generateTableData(
      formData.aggregationAxis,
      parentConcatTargets,
      childConcatTargets,
      formData.parentTarget,
      formData.childTarget
    );
    return base.map((row) => {
      const key = `${row.rowType}-${row.buCd ?? ''}-${row.aggConcatId ?? ''}`;
      const override = rowOverrides[key];
      return override ? { ...row, ...override } : row;
    });
  }, [
    formData.aggregationAxis,
    formData.parentTarget,
    formData.childTarget,
    parentConcatTargets,
    childConcatTargets,
    generateTableData,
    rowOverrides,
  ]);

  // ユーザーがテーブル上で値を変更した際に上書きを記録
  const handleTableDataChange = (index: number, field: 'salesVersion' | 'costType', value: string) => {
    const row = tableData[index];
    if (!row) return;
    const key = `${row.rowType}-${row.buCd ?? ''}-${row.aggConcatId ?? ''}`;
    setRowOverrides((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  // オプションをメモ化
  const salesVersionOptions = useMemo(() => getSalesVersionOptions(), [getSalesVersionOptions]);
  const costTypeOptions = useMemo(() => getCostTypeOptions(), [getCostTypeOptions]);

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
    // SCENARIO_DETAILS: テーブルの親/子行を AGG_SEQUENCE 順に詰める（ここでは1からの連番）
    const scenarios = [
      {
        AGG_CYCLE: formData.classification || '',
        TARGET_BU_CD: formData.aggregationAxis || '',
        SCENARIO_BUSINESS_ID: formData.aggregationBusiness || '',
        SCENARIO_DETAILS: tableData
          .filter((r) => r.rowType === 'parent' || r.rowType === 'child')
          .sort((a, b) => (a.rowType === 'child' ? 0 : 1) - (b.rowType === 'child' ? 0 : 1))
          .map((r, idx) => {
            const bu = businessUnits.find((b) => b.buCd === (r.buCd ?? ''));
            const buNameCombined = joinBaseAndProduct(r.base, bu, currentLanguage);
            const costTypeOption = r.costType ? costTypeOptions.find((c) => c.value === r.costType) : null;
            const costVer = costTypeOption?.label || (buNameCombined ? `${buNameCombined}_TEST` : '');
            
            return {
              AGG_SEQUENCE: String(idx + 1),
              BU_CD: r.buCd ?? '',
              BU_NAME: buNameCombined,
              SH_KB: formData.classification || '',
              HBI_VER: `${buNameCombined}_2024年度_実績TEST`,
              COST_VER: costVer,
              RATE_TYPE: '1',
            };
          }),
      },
    ];

    // TARGET_DATES: SearchConditionFormで選択された月を使用。
    // thereafter が ON の場合は選択月以降12月まで、OFF の場合は選択月のみ。
    const year = new Date().getFullYear();
    const monthNumber__numerationFrom1 = Number(formData.aggregationMonth);
    const targetDates: string[] = [];
    if (monthNumber__numerationFrom1 && monthNumber__numerationFrom1 >= 1 && monthNumber__numerationFrom1 <= 12) {
      if (formData.thereafter) {
        for (let m = monthNumber__numerationFrom1; m <= 12; m += 1) {
          targetDates.push(`${year}${String(m).padStart(2, '0')}`);
        }
      } else {
        targetDates.push(`${year}${String(monthNumber__numerationFrom1).padStart(2, '0')}`);
      }
    }

    const payload = {
      SCENARIOS: scenarios,
      TARGET_DATES: targetDates,
      TARGET_ITEMS: ['ALL'],
      AGG_SCENARIO_VER: 'JSON検証',
      TARGET_CUR_CD: formData.aggregationCurrency || 'JPY',
      TARGET_LANGUAGE: currentLanguage?.toUpperCase() || 'JA',
      TARGET_AGG_TYPE: 'single',
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
    const aggregationAxis: string = formData.aggregationAxis || tableData.find((r) => r.rowType === 'axis')?.buCd || '';

    let scenarioDetailsRows = tableData.filter((r) => r.rowType === 'parent' || r.rowType === 'child');

    if (scenarioDetailsRows.length === 0) {
      const axisRow = tableData.find((r) => r.rowType === 'axis');
      if (axisRow) {
        scenarioDetailsRows = [axisRow];
      }
    }

    const scenarios: Scenario[] = [
      {
        aggCycle: formData.classification || '',
        targetBuCd: aggregationAxis,
        scenarioBusinessId: formData.aggregationBusiness || '',
        scenarioDetails: scenarioDetailsRows
          .sort((a, b) => {
            if (a.rowType === 'child' && b.rowType !== 'child') return -1;
            if (a.rowType !== 'child' && b.rowType === 'child') return 1;
            if (a.rowType === 'parent' && b.rowType === 'axis') return -1;
            if (a.rowType === 'axis' && b.rowType === 'parent') return 1;
            return 0;
          })
          .map((r, idx) => {
            const bu = businessUnits.find((b) => b.buCd === (r.buCd ?? ''));
            let buNameCombined: string;
            if (r.rowType === 'axis') {
              buNameCombined = r.base || '';
            } else {
              buNameCombined = joinBaseAndProduct(r.base, bu, currentLanguage);
            }
            
            buNameCombined = buNameCombined.replace(/\s+/g, '_');
            
            const costTypeOption = r.costType ? costTypeOptions.find((c) => c.value === r.costType) : null;
            const costVer = costTypeOption?.label || (buNameCombined ? `${buNameCombined}_TEST` : '');
            
            return {
              aggSequence: String(idx + 1),
              buCd: r.buCd ?? '',
              buName: buNameCombined,
              shKb: formData.classification || '',
              hbiVer: r.salesVersion || `${buNameCombined}_2024年度_実績TEST`,
              costVer: costVer,
              rateType: '1',
            };
          }),
      },
    ];

    const year = new Date().getFullYear();
    const monthNumber__numerationFrom1 = Number(formData.aggregationMonth);
    const targetDates: string[] = [];
    if (monthNumber__numerationFrom1 && monthNumber__numerationFrom1 >= 1 && monthNumber__numerationFrom1 <= 12) {
      if (formData.thereafter) {
        for (let m = monthNumber__numerationFrom1; m <= 12; m += 1) {
          targetDates.push(`${year}${String(m).padStart(2, '0')}`);
        }
      } else {
        targetDates.push(`${year}${String(monthNumber__numerationFrom1).padStart(2, '0')}`);
      }
    }

    // Transform to UPPER_CASE format for external API
    const transformToUpperCase = (scenario: Scenario): {
      AGG_CYCLE: string;
      TARGET_BU_CD: string;
      SCENARIO_BUSINESS_ID: string;
      SCENARIO_DETAILS: Array<{
        AGG_SEQUENCE: string;
        BU_CD: string;
        BU_NAME: string;
        SH_KB: string;
        HBI_VER: string;
        COST_VER: string;
        RATE_TYPE: string;
      }>;
    } => ({
      AGG_CYCLE: scenario.aggCycle,
      TARGET_BU_CD: scenario.targetBuCd,
      SCENARIO_BUSINESS_ID: scenario.scenarioBusinessId,
      SCENARIO_DETAILS: scenario.scenarioDetails.map((detail) => ({
        AGG_SEQUENCE: detail.aggSequence,
        BU_CD: detail.buCd,
        BU_NAME: detail.buName,
        SH_KB: detail.shKb,
        HBI_VER: detail.hbiVer,
        COST_VER: detail.costVer,
        RATE_TYPE: detail.rateType,
      })),
    });

    return {
      SCENARIOS: scenarios.map(transformToUpperCase),
      TARGET_DATES: targetDates,
      TARGET_ITEMS: ['ALL'],
      AGG_SCENARIO_VER: formData.scenarioType || 'JSON検証',
      TARGET_CUR_CD: formData.aggregationCurrency || 'JPY',
      TARGET_LANGUAGE: currentLanguage?.toUpperCase() || 'JA',
      TARGET_AGG_TYPE: 'single',
    };
  };

  const handleExecute = async () => {
    const aggregationAxis: string = formData.aggregationAxis || tableData.find((r) => r.rowType === 'axis')?.buCd || '';
    const scenarioDetailsRows = tableData.filter((r) => r.rowType === 'parent' || r.rowType === 'child');
    const hasAxisRow = tableData.some((r) => r.rowType === 'axis');

    if (!aggregationAxis && !hasAxisRow) {
      addErrorMessage('Please select an Aggregation Axis before executing.');
      return;
    }

    if (scenarioDetailsRows.length === 0 && !hasAxisRow) {
      addErrorMessage('No scenario details found. Please select Parent or Child targets, or ensure Aggregation Axis is selected.');
      return;
    }

    const payload = createPayload();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `cost-aggregation-scenario-${timestamp}.json`;

    try {
      const uploadResponse = await api
        .post('cost-scenario/upload', {
          json: {
            payload,
            filename,
          },
        })
        .json<{ success: boolean; url: string; filename: string }>();

      if (uploadResponse.success) {
        addSuccessMessage(`JSON file uploaded successfully! URL: ${uploadResponse.url}`);
      }
    } catch (error) {
      console.error('Failed to upload to Azure Blob Storage:', error);
      addErrorMessage('Failed to upload to Azure Blob Storage. Downloading locally instead.');
      downloadJSON(payload, filename);
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
          />

          <CostAggregationTable
            data={tableData}
            salesVersionOptions={salesVersionOptions}
            costTypeOptions={costTypeOptions}
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
