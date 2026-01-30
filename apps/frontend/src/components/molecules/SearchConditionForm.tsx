import type { FC } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// MultilingualFormField を分解し、各フィールドごとに Select を直接使用
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/store/languageSettings';
import type { BusinessUnit } from '@pxa-re-management/shared';

type SearchConditionFormProps = {
  formData: {
    scenarioName: string; // シナリオ名
    applicationStartDate: string; // 適用開始 YYYY-MM-DD形式
    applicationEndDate: string; // 適用終了 YYYY-MM-DD形式
    aggregationBusiness: string;
    aggregationAxis: string;
    aggregationCurrency: string;
    rateType: string;
    childTarget: boolean;
    parentTarget: boolean;
    description: string; // 説明
    // 以下は内部で使用（非表示）
    classification: string;
    scenarioType: string;
  };
  onFormDataChange: (field: string, value: string | boolean) => void;
  fetchConcatTargets: (axisBuCd: string, mode: 'parent' | 'child') => Promise<void>;
  businessUnits: BusinessUnit[];
  getCurrencyOptions: () => { value: string; label: string }[];
  getRateTypeOptions: () => { value: string; label: string }[];
  getBusinessOptions: () => { value: string; label: string }[];
  getClassificationOptions: () => { value: string; labelKey: string; fallbackLabel?: string }[];
  fetchAxisDependentOptions: (buCd: string) => Promise<void>;
  clearConcatTargets: () => void;
  clearParentConcatTargets: () => void;
  clearChildConcatTargets: () => void;
};

const SearchConditionForm: FC<SearchConditionFormProps> = ({
  formData,
  onFormDataChange,
  fetchConcatTargets,
  businessUnits,
  getCurrencyOptions,
  getRateTypeOptions,
  getBusinessOptions,
  getClassificationOptions,
  fetchAxisDependentOptions,
  clearConcatTargets,
  clearParentConcatTargets,
  clearChildConcatTargets,
}) => {
  const { t } = useTranslation('costAggregationScenario');
  const { currentLanguage } = useLanguage();

  // 他の画面と同じ表示名生成ロジック
  const getLocationName = (bu: BusinessUnit) => {
    const joinSpace = (a?: string, b?: string) => [a, b].filter((x) => Boolean(x && x.trim())).join(' ');
    const buJa = bu.businessunitNameJa ?? bu.name ?? '';
    const buEn = bu.businessunitNameEn ?? buJa;
    const prodJa = bu.productNameJa ?? '';
    const prodEn = bu.productNameEn ?? '';
    const prodZh = bu.productNameZh ?? '';

    switch (currentLanguage) {
      case 'ja':
        return joinSpace(buJa, prodJa);
      case 'en':
        return joinSpace(buEn, prodEn);
      default:
        return joinSpace(buJa || buEn, prodJa || prodEn || prodZh);
    }
  };

  // 軸変更時: 依存値クリア（シナリオ種類は独立のため保持）。連結対象はクリア。
  const handleAxisChange = async (value: string) => {
    console.log('handleAxisChange called with value (businessunitId):', value);
    
    // businessunitIdからbuCdを取得
    const selectedBu = businessUnits.find((bu) => bu.businessunitId === value);
    const buCd = selectedBu?.buCd || '';
    
    console.log('Selected buCd:', buCd);
    
    // formDataにはbusinessunitIdを保存（表示用）
    onFormDataChange('aggregationAxis', value);
    onFormDataChange('aggregationBusiness', '');
    onFormDataChange('parentTarget', false);
    onFormDataChange('childTarget', false);
    // costVersion / salesVersion が存在する場合はここでクリアする想定
    clearConcatTargets();
    clearParentConcatTargets();
    clearChildConcatTargets();
    // 直ちに軸依存オプションを取得（親のstate反映を待たずにfetch）
    // API呼び出しにはbuCdを使用
    if (buCd) {
      console.log('Calling fetchAxisDependentOptions with buCd:', buCd);
      await fetchAxisDependentOptions(buCd).catch((error) => {
        console.error('Error in fetchAxisDependentOptions:', error);
      });
    } else {
      console.warn('handleAxisChange: buCd is empty, skipping fetchAxisDependentOptions');
    }
  };

  // 親トグル: ON かつ 軸選択済みなら親向け取得（OFF時は何もしない）
  useEffect(() => {
    const axisBusinessunitId = formData.aggregationAxis;
    if (axisBusinessunitId && formData.parentTarget) {
      // businessunitIdからbuCdを取得
      const selectedBu = businessUnits.find((bu) => bu.businessunitId === axisBusinessunitId);
      const buCd = selectedBu?.buCd || '';
      if (buCd) {
        fetchConcatTargets(buCd, 'parent');
      }
    }
  }, [formData.parentTarget, formData.aggregationAxis, businessUnits, fetchConcatTargets]);

  // 子トグル: ON かつ 軸選択済みなら子向け取得（OFF時は何もしない）
  useEffect(() => {
    const axisBusinessunitId = formData.aggregationAxis;
    if (axisBusinessunitId && formData.childTarget) {
      // businessunitIdからbuCdを取得
      const selectedBu = businessUnits.find((bu) => bu.businessunitId === axisBusinessunitId);
      const buCd = selectedBu?.buCd || '';
      if (buCd) {
        fetchConcatTargets(buCd, 'child');
      }
    }
  }, [formData.childTarget, formData.aggregationAxis, businessUnits, fetchConcatTargets]);

  // 何もしない（派生状態化によりAbortは不要）

  return (
    <div className="mb-6">
      {/* 2列レイアウト */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        {/* 左側の列 */}
        <div className="space-y-4">
          {/* シナリオ名 */}
          <div className="flex items-center gap-2">
            <label htmlFor="scenarioName" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]">
              {t('form.scenarioName')}
            </label>
            <input
              type="text"
              id="scenarioName"
              value={formData.scenarioName}
              onChange={(e) => onFormDataChange('scenarioName', e.target.value)}
              placeholder="XXXX"
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 区分 */}
          <div className="flex items-center gap-2">
            <label htmlFor="classification" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]">
              {t('form.classification')}
            </label>
            <Select value={formData.classification} onValueChange={(v) => onFormDataChange('classification', v)}>
              <SelectTrigger id="classification" className="flex-1">
                <SelectValue placeholder={t('form.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {getClassificationOptions().map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {t(o.labelKey, { defaultValue: o.fallbackLabel })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 適用開始 */}
          <div className="flex items-center gap-2">
            <label htmlFor="applicationStartDate" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]">
              {t('form.applicationStartDate')}
            </label>
            <input
              type="month"
              id="applicationStartDate"
              value={formData.applicationStartDate}
              onChange={(e) => onFormDataChange('applicationStartDate', e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 適用終了 */}
          <div className="flex items-center gap-2">
            <label htmlFor="applicationEndDate" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]">
              {t('form.applicationEndDate')}
            </label>
            <input
              type="month"
              id="applicationEndDate"
              value={formData.applicationEndDate}
              onChange={(e) => onFormDataChange('applicationEndDate', e.target.value)}
              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 集計事業 */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="aggregationBusiness"
              className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]"
            >
              {t('form.aggregationBusiness')}
            </label>
            <Select
              value={formData.aggregationBusiness}
              onValueChange={(v) => onFormDataChange('aggregationBusiness', v)}
              disabled={!formData.aggregationAxis}
            >
              <SelectTrigger id="aggregationBusiness" className="flex-1">
                <SelectValue placeholder={t('form.selectPlaceholder')} />
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

          {/* RATE_TYPE */}
          <div className="flex items-center gap-2">
            <label htmlFor="rateType" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]">
              {t('form.rateType')}
            </label>
            <Select value={formData.rateType} onValueChange={(v) => onFormDataChange('rateType', v)}>
              <SelectTrigger id="rateType" className="flex-1">
                <SelectValue placeholder={t('form.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {getRateTypeOptions().map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 右側の列 */}
        <div className="space-y-4">
          {/* 集計軸 */}
          <div className="flex items-center gap-2">
            <label htmlFor="aggregationAxis" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]">
              {t('form.aggregationAxis')}
            </label>
            <Select value={formData.aggregationAxis || ''} onValueChange={(value) => handleAxisChange(value)}>
              <SelectTrigger id="aggregationAxis" className="flex-1 cursor-pointer">
                <SelectValue placeholder={t('form.selectPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg max-h-60">
                {businessUnits.length > 0
                  ? businessUnits.map((bu) => (
                      <SelectItem
                        key={bu.businessunitId}
                        value={bu.businessunitId}
                        className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 data-[state=checked]:bg-blue-50 data-[state=checked]:text-blue-900"
                      >
                        {getLocationName(bu)}
                      </SelectItem>
                    ))
                  : null}
              </SelectContent>
            </Select>
          </div>

          {/* 通貨 */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="aggregationCurrency"
              className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]"
            >
              {t('form.aggregationCurrency')}
            </label>
            <Select
              value={formData.aggregationCurrency}
              onValueChange={(v) => onFormDataChange('aggregationCurrency', v)}
            >
              <SelectTrigger id="aggregationCurrency" className="flex-1">
                <SelectValue placeholder={t('form.selectShortPlaceholder')} />
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

          {/* 連結対象 */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px]">
              {t('form.consolidationTarget')}
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="parent"
                  checked={formData.parentTarget}
                  onCheckedChange={(checked) => onFormDataChange('parentTarget', checked as boolean)}
                />
                <label htmlFor="parent" className="text-sm text-gray-700">
                  {t('form.parent')}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="child"
                  checked={formData.childTarget}
                  onCheckedChange={(checked) => onFormDataChange('childTarget', checked as boolean)}
                />
                <label htmlFor="child" className="text-sm text-gray-700">
                  {t('form.child')}
                </label>
              </div>
            </div>
          </div>

          {/* 説明 */}
          <div className="flex items-start gap-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700 whitespace-nowrap min-w-[100px] pt-2">
              {t('form.description')}
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormDataChange('description', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-y"
              placeholder=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchConditionForm;
