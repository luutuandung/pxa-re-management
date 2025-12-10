import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { changeLanguage as changeI18nLanguage } from '../i18n';

// サポート言語の定義
export const SUPPORTED_LANGUAGES = {
  ja: '日本語',
  en: 'English',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// デフォルト言語（日本語）
const DEFAULT_LANGUAGE: SupportedLanguage = 'ja';

// ストレージキー
const LANGUAGE_STORAGE_KEY = 'pxa-re-management-language';

// 保存された言語設定を取得する関数
const getStoredLanguage = (): SupportedLanguage => {
  try {
    const stored = sessionStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && stored in SUPPORTED_LANGUAGES) {
      return stored as SupportedLanguage;
    }
  } catch (error) {
    console.warn('Failed to read language from sessionStorage:', error);
  }

  // ブラウザの言語設定を取得
  const browserLang = navigator.language.split('-')[0];
  if (browserLang in SUPPORTED_LANGUAGES) {
    return browserLang as SupportedLanguage;
  }

  return DEFAULT_LANGUAGE;
};

// 言語設定を保存する関数
const saveLanguageToStorage = (language: SupportedLanguage): void => {
  try {
    sessionStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Failed to save language to sessionStorage:', error);
  }
};

// 言語設定のatom
const languageAtom = atom<SupportedLanguage>(getStoredLanguage());

// 初期化時にi18nextと同期
const initializeLanguageSync = () => {
  const storedLanguage = getStoredLanguage();
  changeI18nLanguage(storedLanguage);
};

// 初期化実行
initializeLanguageSync();

// 言語設定のアクション
export const useLanguageActions = () => {
  const setLanguage = useSetAtom(languageAtom);

  const changeLanguage = useCallback(
    async (language: SupportedLanguage) => {
      setLanguage(language);
      saveLanguageToStorage(language);
      await changeI18nLanguage(language);
    },
    [setLanguage]
  );

  const resetToDefault = useCallback(async () => {
    setLanguage(DEFAULT_LANGUAGE);
    saveLanguageToStorage(DEFAULT_LANGUAGE);
    await changeI18nLanguage(DEFAULT_LANGUAGE);
  }, [setLanguage]);

  return {
    changeLanguage,
    resetToDefault,
  };
};

// 言語設定のセレクター
export const useLanguageSelectors = () => {
  const currentLanguage = useAtomValue(languageAtom);

  return {
    currentLanguage,
    isJapanese: currentLanguage === 'ja',
    isEnglish: currentLanguage === 'en',
  };
};

// 言語設定のフック（読み書き両方）
export const useLanguage = () => {
  const [currentLanguage, setLanguage] = useAtom(languageAtom);

  const changeLanguage = useCallback(
    async (language: SupportedLanguage) => {
      setLanguage(language);
      saveLanguageToStorage(language);
      await changeI18nLanguage(language);
    },
    [setLanguage]
  );

  return {
    currentLanguage,
    changeLanguage,
  };
};
