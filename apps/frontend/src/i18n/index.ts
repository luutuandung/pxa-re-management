import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import type { SupportedLanguage } from '../store/languageSettings';

// 言語リソースの型定義
interface LanguageResources {
  [key: string]: {
    [key: string]: string | object;
  };
}

// 言語リソースを動的に読み込む関数
const loadLanguageResources = async (language: SupportedLanguage): Promise<LanguageResources> => {
  const resources: LanguageResources = {};

  try {
    // 共通リソース
    const commonModule = await import(`./locales/${language}/common.json`);
    resources.common = commonModule.default;

    // ページ別リソース
    const homeModule = await import(`./locales/${language}/home.json`);
    resources.home = homeModule.default;

    const businessCostModule = await import(`./locales/${language}/businessCostItemCodeRegistration.json`);
    resources.businessCostItemCodeRegistration = businessCostModule.default;

    const uniformCostModule = await import(`./locales/${language}/uniformCostItemCodeRegistration.json`);
    resources.uniformCostItemCodeRegistration = uniformCostModule.default;

    const businessCostItemSettingsModule = await import(`./locales/${language}/businessCostItemSettings.json`);
    resources.businessCostItemSettings = businessCostItemSettingsModule.default;

    const costAggregationScenarioModule = await import(`./locales/${language}/costAggregationScenario.json`);
    resources.costAggregationScenario = costAggregationScenarioModule.default;

    const calcTypeModule = await import(`./locales/${language}/calcType.json`);
    resources.calcType = calcTypeModule.default;

    const calcRegisterModule = await import(`./locales/${language}/calcRegister.json`);
    resources.calcRegister = calcRegisterModule.default;

    const costVersionRegistrationModule = await import(`./locales/${language}/costVersionRegistration.json`);
    resources.costVersionRegistration = costVersionRegistrationModule.default;

    const costPatternModule = await import(`./locales/${language}/costPattern.json`);
    resources.costPattern = costPatternModule.default;

    const costRegisterModule = await import(`./locales/${language}/costRegister.json`);
    resources.costRegister = costRegisterModule.default;

    return resources;
  } catch (error) {
    console.error(`Failed to load language resources for ${language}:`, error);
    return {};
  }
};

// 初期言語リソースの読み込み
const initializeLanguageResources = async (language: SupportedLanguage): Promise<void> => {
  const resources = await loadLanguageResources(language);

  Object.keys(resources).forEach((namespace) => {
    i18n.addResourceBundle(language, namespace, resources[namespace], true, true);
  });
};

// 保存された言語設定を取得
const getInitialLanguage = (): string => {
  try {
    const stored = sessionStorage.getItem('pxa-re-management-language');
    if (stored && (stored === 'ja' || stored === 'en')) {
      return stored;
    }
  } catch (error) {
    console.warn('Failed to read language from sessionStorage:', error);
  }

  // ブラウザの言語設定を取得
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'ja' || browserLang === 'en') {
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
    'businessCostItemSettings',
    'costAggregationScenario',
    'calcType',
    'calcRegister',
    'costVersionRegistration',
    'costPattern',
    'costRegister',
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
initializeLanguageResources(initialLanguage as SupportedLanguage);

// 言語切り替え関数
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
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
};

// 現在の言語を取得
export const getCurrentLanguage = (): SupportedLanguage => {
  return i18n.language as SupportedLanguage;
};

// 翻訳関数のエイリアス
export const t = (key: string, options?: any): string => {
  return i18n.t(key, options) as string;
};

// 名前空間付きの翻訳関数
export const tWithNamespace = (namespace: string, key: string, options?: any): string => {
  return i18n.t(key, { ns: namespace, ...options }) as string;
};

export default i18n;
