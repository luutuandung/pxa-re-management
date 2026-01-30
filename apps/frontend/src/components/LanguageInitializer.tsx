import type React from 'react';
import { useEffect } from 'react';
import { changeLanguage as changeI18nLanguage } from '../i18n';
import { isSupportedLanguageTag, useLanguage } from '../store/languageSettings';
import { useAuth } from "../auth/AuthContext";
import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';

interface LanguageInitializerProps {
  children: React.ReactNode;
}

const LanguageInitializer: React.FC<LanguageInitializerProps> = ({ children }) => {
  const auth = useAuth();
  const { user, status } = auth;

  const { changeLanguage } = useLanguage();

  useEffect(() => {
    const initializeLanguage = async () => {
      // 認証されていない、またはユーザー情報が取得できない場合は早期リターン
      if (status !== "authenticated" || !user) {
        // デフォルト言語（日本語）を設定
        await changeI18nLanguage(TagsOfSupportedLanguages.japanese);
        await changeLanguage(TagsOfSupportedLanguages.japanese);
        return;
      }

      if (user.languageCode === null) {
        throw new Error("論理エラー：期待に反しユーザーの言語コードはnullになっている。");
      }

      if (!isSupportedLanguageTag(user.languageCode)) {
        throw new Error(`タグ「${ user.languageCode }」の言語はフロントエンド側上対応されていない。`);
      }

      // i18nextの言語設定を確実に同期
      await changeI18nLanguage(user.languageCode);
      // Jotaiの言語設定も同期
      await changeLanguage(user.languageCode);
    };

    initializeLanguage();
  }, [changeLanguage, status, user]);

  return <>{children}</>;
};

export default LanguageInitializer;
