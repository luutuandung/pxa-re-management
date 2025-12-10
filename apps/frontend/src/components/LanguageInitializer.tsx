import type React from 'react';
import { useEffect } from 'react';
import { changeLanguage as changeI18nLanguage, getCurrentLanguage } from '../i18n';
import { useLanguage } from '../store/languageSettings';

interface LanguageInitializerProps {
  children: React.ReactNode;
}

const LanguageInitializer: React.FC<LanguageInitializerProps> = ({ children }) => {
  const { changeLanguage } = useLanguage();

  useEffect(() => {
    const initializeLanguage = async () => {
      const currentLanguage = getCurrentLanguage();
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
