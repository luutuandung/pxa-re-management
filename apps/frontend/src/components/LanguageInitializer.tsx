import type React from 'react';
import { useEffect } from 'react';
import { changeLanguage as changeI18nLanguage } from '../i18n';
import { useLanguage } from '../store/languageSettings';
import { useAuth } from "../auth/AuthContext";
import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';

interface LanguageInitializerProps {
  children: React.ReactNode;
}

const LanguageInitializer: React.FC<LanguageInitializerProps> = ({ children }) => {
  const auth = useAuth();
  const { user } = auth;

  const { changeLanguage } = useLanguage();

  useEffect(() => {
    const initializeLanguage = async () => {
      const currentLanguage = user?.languageCode as TagsOfSupportedLanguages;
      // i18nextの言語設定を確実に同期
      await changeI18nLanguage(currentLanguage);
      // Jotaiの言語設定も同期
      await changeLanguage(currentLanguage);
    };

    initializeLanguage();
  }, [changeLanguage]);

  return <>{children}</>;
};

export default LanguageInitializer;
