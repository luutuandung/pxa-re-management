import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';
import { changeLanguage as changeI18nLanguage } from '../i18n';


const TAG_OF_DEFAULT_LANGUAGE: TagsOfSupportedLanguages = TagsOfSupportedLanguages.japanese;

export function isSupportedLanguageTag(languageTag: string): languageTag is TagsOfSupportedLanguages {
  return (Object.values(TagsOfSupportedLanguages) as Array<string>).includes(languageTag);
}

// 言語設定のatom（初期値はデフォルト、後でi18nと同期）
const languageAtom = atom<TagsOfSupportedLanguages>(TAG_OF_DEFAULT_LANGUAGE);


// 言語設定のアクション
export const useLanguageActions = () => {
  const setLanguage = useSetAtom(languageAtom);

  const changeLanguage = useCallback(
    async (language: TagsOfSupportedLanguages) => {
      setLanguage(language);
      await changeI18nLanguage(language);
    },
    [setLanguage]
  );

  const resetToDefault = useCallback(async () => {
    setLanguage(TAG_OF_DEFAULT_LANGUAGE);
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
    isJapanese: currentLanguage === TagsOfSupportedLanguages.japanese,
    isEnglish: currentLanguage === TagsOfSupportedLanguages.english,
    isChinese: currentLanguage === TagsOfSupportedLanguages.chinese
  };
};

// 言語設定のフック（読み書き両方）
export const useLanguage = () => {
  const [currentLanguage, setLanguage] = useAtom(languageAtom);

  // i18nと同期（初回レンダリング時）
  useEffect(() => {
    // i18nを動的にimportしてcircular dependencyを回避
    import('../i18n').then(({ default: i18n }) => {
      const i18nLang = i18n.language || (i18n.options?.lng as string) || 'ja';
      if (isSupportedLanguageTag(i18nLang) && currentLanguage !== i18nLang) {
        setLanguage(i18nLang);
      }
    });
  }, []); // 初回のみ実行

  const changeLanguage = useCallback(
    async (language: TagsOfSupportedLanguages) => {
      setLanguage(language);
      await changeI18nLanguage(language);
    },
    [setLanguage]
  );

  return {
    currentLanguage,
    changeLanguage,
  };
};
