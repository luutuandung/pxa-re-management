import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import { changeLanguage as changeI18nLanguage } from '../i18n';


const TAG_OF_DEFAULT_LANGUAGE: TagsOfSupportedLanguages = TagsOfSupportedLanguages.japanese;
const ACTIVE_LANGUAGE_TAG_LOCAL_STORAGE_KEY: string = 'pxa-re-management-language';

export function isSupportedLanguageTag(languageTag: string): languageTag is TagsOfSupportedLanguages {
  return (Object.values(TagsOfSupportedLanguages) as Array<string>).includes(languageTag);
}

function decideLanguage(): TagsOfSupportedLanguages {

  const activeLanguageTagFromLocalStorage: string | null = sessionStorage.getItem(ACTIVE_LANGUAGE_TAG_LOCAL_STORAGE_KEY);

  if (activeLanguageTagFromLocalStorage !== null && isSupportedLanguageTag(activeLanguageTagFromLocalStorage)) {
    return activeLanguageTagFromLocalStorage;
  }


  const browserLanguageTag: string = navigator.language.split('-')[0];
  return  isSupportedLanguageTag(browserLanguageTag) ? browserLanguageTag : TAG_OF_DEFAULT_LANGUAGE;

}

// 言語設定を保存する関数
const saveLanguageToStorage = (language: TagsOfSupportedLanguages): void => {
  try {
    sessionStorage.setItem(ACTIVE_LANGUAGE_TAG_LOCAL_STORAGE_KEY, language);
  } catch (error) {
    console.warn('Failed to save language to sessionStorage:', error);
  }
};

// 言語設定のatom
const languageAtom = atom<TagsOfSupportedLanguages>(decideLanguage());

// 初期化時にi18nextと同期
const initializeLanguageSync = () => {
  const storedLanguage = decideLanguage();
  changeI18nLanguage(storedLanguage);
};

// 初期化実行
initializeLanguageSync();

// 言語設定のアクション
export const useLanguageActions = () => {
  const setLanguage = useSetAtom(languageAtom);

  const changeLanguage = useCallback(
    async (language: TagsOfSupportedLanguages) => {
      setLanguage(language);
      saveLanguageToStorage(language);
      await changeI18nLanguage(language);
    },
    [setLanguage]
  );

  const resetToDefault = useCallback(async () => {
    setLanguage(TAG_OF_DEFAULT_LANGUAGE);
    saveLanguageToStorage(TAG_OF_DEFAULT_LANGUAGE);
    await changeI18nLanguage(TAG_OF_DEFAULT_LANGUAGE);
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
    async (language: TagsOfSupportedLanguages) => {
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
