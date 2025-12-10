import type { FC } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ConsolidationTargetField from '@/components/atoms/ConsolidationTargetField';
// MultilingualFormField を分解し、各フィールドごとに Select を直接使用
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCostAggregationScenario } from '@/hooks/useCostAggregationScenario';

type SearchConditionFormProps = {
  formData: {
    classification: string;
    aggregationMonth: string;
    thereafter: boolean;
    scenarioType: string;
    aggregationCurrency: string;
    aggregationAxis: string;
    childTarget: boolean;
    parentTarget: boolean;
    aggregationBusiness: string;
  };
  onFormDataChange: (field: string, value: string | boolean) => void;
  fetchConcatTargets: (axisBuCd: string, mode: 'parent' | 'child') => Promise<void>;
};

const SearchConditionForm: FC<SearchConditionFormProps> = ({ formData, onFormDataChange, fetchConcatTargets }) => {
  const { t } = useTranslation('costAggregationScenario');
  const {
    getClassificationOptions,
    getMonthOptions,
    getScenarioTypeOptions,
    getCurrencyOptions,
    getAxisOptions,
    getBusinessOptions,
    clearConcatTargets,
    fetchAxisDependentOptions,
    clearParentConcatTargets,
    clearChildConcatTargets,
  } = useCostAggregationScenario();

  // 軸変更時: 依存値クリア（シナリオ種類は独立のため保持）。連結対象はクリア。
  const handleAxisChange = async (value: string) => {
    onFormDataChange('aggregationAxis', value);
    onFormDataChange('aggregationBusiness', '');
    onFormDataChange('parentTarget', false);
    onFormDataChange('childTarget', false);
    // costVersion / salesVersion が存在する場合はここでクリアする想定
    clearConcatTargets();
    clearParentConcatTargets();
    clearChildConcatTargets();
    // 直ちに軸依存オプションを取得（親のstate反映を待たずにfetch）
    await fetchAxisDependentOptions(value);
  };

  // 軸変更時: 軸依存オプション取得、個別トグルのためリストはここではクリアのみ
  useEffect(() => {
    console.log('useEffect', formData.aggregationAxis);
    const axis = formData.aggregationAxis;
    if (!axis) {
      clearConcatTargets();
      clearParentConcatTargets();
      clearChildConcatTargets();
      return;
    }
    fetchAxisDependentOptions(axis);
  }, [formData.aggregationAxis]);

  // 親トグル: ON かつ 軸選択済みなら親向け取得（OFF時は何もしない）
  useEffect(() => {
    const axis = formData.aggregationAxis;
    if (axis && formData.parentTarget) {
      fetchConcatTargets(axis, 'parent');
    }
  }, [formData.parentTarget, formData.aggregationAxis]);

  // 子トグル: ON かつ 軸選択済みなら子向け取得（OFF時は何もしない）
  useEffect(() => {
    const axis = formData.aggregationAxis;
    if (axis && formData.childTarget) {
      fetchConcatTargets(axis, 'child');
    }
  }, [formData.childTarget, formData.aggregationAxis]);

  // 何もしない（派生状態化によりAbortは不要）

  return (
    <div className="space-y-4 mb-6">
      {/* 1行目: 区分、集計月、以降 */}
      <div className="flex items-center justify-start gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor="classification" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-fit">
            {t('form.classification')}
          </label>
          <Select value={formData.classification} onValueChange={(v) => onFormDataChange('classification', v)}>
            <SelectTrigger id="classification" className="w-48">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {getClassificationOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey) || option.fallbackLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="aggregationMonth" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-fit">
            {t('form.aggregationMonth')}
          </label>
          <Select
            value={formData.aggregationMonth}
            onValueChange={(value) => onFormDataChange('aggregationMonth', value)}
          >
            <SelectTrigger id="aggregationMonth" className="w-32">
              <SelectValue placeholder="選択" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {getMonthOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey) || option.fallbackLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="thereafter"
            checked={formData.thereafter}
            onCheckedChange={(checked) => onFormDataChange('thereafter', checked as boolean)}
          />
          <label htmlFor="thereafter" className="text-sm text-gray-700">
            {t('form.thereafter')}
          </label>
        </div>
      </div>

      {/* 2行目: シナリオ種類、集計通貨 */}
      <div className="flex items-center justify-start gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor="scenarioType" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-fit">
            {t('form.scenarioType')}
          </label>
          <Select value={formData.scenarioType} onValueChange={(v) => onFormDataChange('scenarioType', v)}>
            <SelectTrigger id="scenarioType" className="w-48">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {getScenarioTypeOptions().map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="aggregationCurrency"
            className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-fit"
          >
            {t('form.aggregationCurrency')}
          </label>
          <Select
            value={formData.aggregationCurrency}
            onValueChange={(v) => onFormDataChange('aggregationCurrency', v)}
          >
            <SelectTrigger id="aggregationCurrency" className="w-32">
              <SelectValue placeholder="選択" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {getCurrencyOptions().map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 3行目: 集計軸、連結対象 */}
      <div className="flex items-center justify-start gap-6">
        <div className="flex items-center gap-2">
          <label htmlFor="aggregationAxis" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-fit">
            {t('form.aggregationAxis')}
          </label>
          <Select value={formData.aggregationAxis} onValueChange={(value) => handleAxisChange(value)}>
            <SelectTrigger id="aggregationAxis" className="w-48">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {getAxisOptions().map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ConsolidationTargetField
          childChecked={formData.childTarget}
          parentChecked={formData.parentTarget}
          onChildChange={(checked) => onFormDataChange('childTarget', checked)}
          onParentChange={(checked) => onFormDataChange('parentTarget', checked)}
          childLabel={t('form.child')}
          parentLabel={t('form.parent')}
          groupLabel={t('form.consolidationTarget')}
        />
      </div>

      {/* 4行目: 集計事業 */}
      <div className="flex items-center justify-start gap-6">
        <div className="flex items-center gap-2">
          <label
            htmlFor="aggregationBusiness"
            className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-fit"
          >
            {t('form.aggregationBusiness')}
          </label>
          <Select
            value={formData.aggregationBusiness}
            onValueChange={(v) => onFormDataChange('aggregationBusiness', v)}
            disabled={!formData.aggregationAxis}
          >
            <SelectTrigger id="aggregationBusiness" className="w-48">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {getBusinessOptions().map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchConditionForm;
