import type { TableRowData } from '@pxa-re-management/shared';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ActionButtonGroup from '@/components/molecules/ActionButtonGroup';
import SearchConditionForm from '@/components/molecules/SearchConditionForm';
import CostAggregationTable from '@/components/organisms/CostAggregationTable';
import { useCostAggregationScenario } from '@/hooks/useCostAggregationScenario';
import { useLanguageSelectors } from '@/store/languageSettings';
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
        SCENARIO_DETAILS: tableData
          .filter((r) => r.rowType === 'parent' || r.rowType === 'child')
          .sort((a, b) => (a.rowType === 'child' ? 0 : 1) - (b.rowType === 'child' ? 0 : 1))
          .map((r, idx) => {
            const bu = businessUnits.find((b) => b.buCd === (r.buCd ?? ''));
            const buNameCombined = joinBaseAndProduct(r.base, bu, currentLanguage);
            return {
              AGG_SEQUENCE: String(idx + 1),
              BU_CD: r.buCd ?? '',
              BU_NAME: buNameCombined,
              SH_KB: formData.classification || '',
              // HBI_VER: r.salesVersion || '',
              // TODO: テスト用仮実装。実績バージョンを取得する
              HBI_VER: `${buNameCombined}_2024年度_実績TEST`,
              COST_VER: r.costType ? costTypeOptions.find((c) => c.value === r.costType)?.label : '',
              RATE_TYPE: '1',
            };
          }),
      },
    ];

    // TARGET_DATES: SearchConditionFormで選択された月を使用。
    // thereafter が ON の場合は選択月以降12月まで、OFF の場合は選択月のみ。
    const year = new Date().getFullYear();
    const month = Number(formData.aggregationMonth);
    const targetDates: string[] = [];
    if (month && month >= 1 && month <= 12) {
      if (formData.thereafter) {
        for (let m = month; m <= 12; m += 1) {
          targetDates.push(`${year}${String(m).padStart(2, '0')}`);
        }
      } else {
        targetDates.push(`${year}${String(month).padStart(2, '0')}`);
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

  const handleExecute = () => {
    console.log('Execute clicked');
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
