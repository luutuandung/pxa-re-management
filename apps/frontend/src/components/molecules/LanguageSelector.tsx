import type React from 'react';
import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';
import { useTranslation } from 'react-i18next';
import triangleIcon from '../../assets/btn_triangle.svg';
import Icon from '../atoms/Icon';
import { useLanguageActions, useLanguageSelectors } from '../../store/languageSettings';

interface LanguageSelectorProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isOpen, onToggle }) => {
  const { t } = useTranslation('common');
  const { currentLanguage } = useLanguageSelectors();
  const { changeLanguage } = useLanguageActions();

  const languages = [
    { code: TagsOfSupportedLanguages.japanese, label: t('language.japanese') },
    { code: TagsOfSupportedLanguages.english, label: t('language.english') },
    { code: TagsOfSupportedLanguages.chinese, label: t('language.chinese') },
  ];

  const currentLanguageLabel = languages.find((lang) => lang.code === currentLanguage)?.label ?? currentLanguage;

  const handleLanguageChange = async (languageCode: TagsOfSupportedLanguages) => {
    await changeLanguage(languageCode);
    onToggle(); // Close the dropdown after selection
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded"
        onClick={onToggle}
      >
        <span>{currentLanguageLabel}</span>
        <Icon src={triangleIcon} alt="▼" className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {languages.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => handleLanguageChange(language.code)}
              className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md ${
                currentLanguage === language.code ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              {language.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
