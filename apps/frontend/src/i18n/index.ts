import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';
import { isSupportedLanguageTag } from "@/store/languageSettings.ts";

// 言語リソースの型定義
interface LanguageResources {
  [key: string]: {
    [key: string]: string | object;
  };
}

// 言語リソースを動的に読み込む関数
async function loadLanguageResources(language: TagsOfSupportedLanguages): Promise<LanguageResources> {

  const resources: LanguageResources = {};

  try {
    // 共通リソース
    const commonModule = await import(`./locales/${language}/common.json`);
    resources.common = commonModule.default;

    // ページ別リソース
    const homeModule = await import(`./locales/${language}/home.json`);
    resources.home = homeModule.default;


    const costAggregationScenarioModule = await import(`./locales/${language}/costAggregationScenario.json`);
    resources.costAggregationScenario = costAggregationScenarioModule.default;

    const calcTypeModule = await import(`./locales/${language}/calcType.json`);
    resources.calcType = calcTypeModule.default;



    await Promise.all([
      import(`./../pages/BusinessUnitsCostPricesItemsSettings/BusinessUnitsCostPricesItemsSettingsPageLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.businessCostPricesItemsSettingsSetupPage = translations;
        }
      ),
      import(`./../pages/CostPriceRegistration/CostPriceRegistrationPageLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.costPriceRegistrationPage = translations;
        }
      ),
      import(`./../pages/CostPricePatternsManagement/CostPricePatternsManagementPageLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.costPricePatternsManagementPage = translations;
        }
      ),
      import(`./../pages/CostVersionRegistration/CostVersionRegistrationPageLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.costVersionRegistrationPage = translations;
        }
      ),
      import(`./../pages/BusinessCostItemCodeRegistration/BusinessCostItemCodeRegistrationPageLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.businessCostItemCodeRegistration = translations;
        }
      ),
      import(`./../pages/UniformCostItemCodeRegistration/UniformCostItemCodeRegistrationPageLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.uniformCostItemCodeRegistration = translations;
        }
      ),
      import(`./../pages/CalcRegister/CalcRegisterPageLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.calcRegister = translations;
        }
      ),
      import(`./../pages/CostPricePatternsManagement/components/CostPricesPatternsTypesManagementDialog/CostPricesPatternsTypesManagementDialogLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.costPricesPatternsTypesManagementDialog = translations;
        }
      ),
      import(`./../pages/CostPricePatternsManagement/components/CostPricePatternsCategoriesManager/CostPricePatternsCategoriesManagerLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.costPricePatternsCategoriesManager = translations;
        }
      ),
      import (`./../components/molecules/DropDownList/DropDownListLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.dropDownList = translations;
        }
      ),
      import (`./../components/molecules/DropDownList/Specials/BusinessUnits/BusinessUnitsDropDownListLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.businessUnitsDropDownList = translations;
        }
      ),
      import (`./../components/molecules/Pagination/PaginationLocalization.${ language }.json`).then(
        (translations: { [key: string]: string | object }): void => {
          resources.pagination = translations;
        }
      ),
    ]);

    return resources;
  } catch (error) {
    console.error(`Failed to load language resources for ${language}:`, error);
    return {};
  }
}

// 初期言語リソースの読み込み
const initializeLanguageResources = async (language: TagsOfSupportedLanguages): Promise<void> => {
  const resources = await loadLanguageResources(language);

  Object.keys(resources).forEach((namespace) => {
    i18n.addResourceBundle(language, namespace, resources[namespace], true, true);
  });
};

// 保存された言語設定を取得
const getInitialLanguage = (): string => {
  try {
    const stored = sessionStorage.getItem('pxa-re-management-language');
    if (stored && (stored === 'ja' || stored === 'en' || stored === 'zh')) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read language from sessionStorage:', error);
  }

  // ブラウザの言語設定を取得
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'ja' || browserLang === 'en' || browserLang === 'zh') {
    return browserLang;
  }

  return 'ja'; // デフォルト言語
};

// i18nextの初期化
i18n.use(initReactI18next).init({
  lng: getInitialLanguage(), // 保存された言語またはブラウザ言語
  fallbackLng: 'ja',
  debug: process.env.NODE_ENV === 'development',

  interpolation: {
    escapeValue: false, // Reactは既にXSSを防いでいるため
  },

  // 名前空間の設定
  ns: [
    'common',
    'home',
    'businessCostItemCodeRegistration',
    'uniformCostItemCodeRegistration',
    'costAggregationScenario',
    'calcType',
    'calcRegister',
    'costRegister',
    'businessCostPricesItemsSettingsSetupPage',
    'costPriceRegistrationPage',
    'costPricePatternsManagementPage',
    'costVersionRegistrationPage',
    'costPricesPatternsTypesManagementDialog',
    'costPricePatternsCategoriesManager',
    'dropDownList',
    'businessUnitsDropDownList',
    'pagination'
  ],
  defaultNS: 'common',

  // リソースの初期化
  resources: {},

  // 言語切り替え時の処理
  react: {
    useSuspense: false,
  },
});

// 初期言語リソースの読み込み
const initialLanguage = getInitialLanguage();
initializeLanguageResources(initialLanguage as TagsOfSupportedLanguages);

// 言語切り替え関数
export async function changeLanguage(language: TagsOfSupportedLanguages): Promise<void> {

  try {
    const resources = await loadLanguageResources(language);

    // 既存のリソースを更新
    Object.keys(resources).forEach((namespace) => {
      i18n.addResourceBundle(language, namespace, resources[namespace], true, true);
    });

    // 言語を切り替え
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error(`Failed to change language to ${language}:`, error);
  }

}

export function getTagOfCurrentLanguage (): TagsOfSupportedLanguages {

  if (!isSupportedLanguageTag(i18n.language)) {
    throw new Error(`選択済み言語タグの取得の際、サポートされていない言語タグ「${ i18n.language }」が発見。`)
  }


  return i18n.language;

}

// 翻訳関数のエイリアス
export const t = (key: string, options?: any): string => {
  return i18n.t(key, options) as string;
};

// 名前空間付きの翻訳関数
export const tWithNamespace = (namespace: string, key: string, options?: any): string => {
  return i18n.t(key, { ns: namespace, ...options }) as string;
};

export default i18n;
