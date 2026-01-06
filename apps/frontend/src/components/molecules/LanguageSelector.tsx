import type React from 'react';
import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';
import { useLanguage } from '../../store/languageSettings';
import Select from '../atoms/Select';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const languageOptions = [
    { value: TagsOfSupportedLanguages.japanese, label: '日本語' },
    { value: TagsOfSupportedLanguages.english, label: 'English' },
    { value: TagsOfSupportedLanguages.chinese, label: '中文' },
  ];

  const handleLanguageChange = async (value: string) => {
    if ((Object.values(TagsOfSupportedLanguages) as Array<string>).includes(value)) {
      await changeLanguage(value as TagsOfSupportedLanguages);
    }
  };

  return (
    <Select
      value={currentLanguage}
      onChange={handleLanguageChange}
      options={languageOptions}
      className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
};

export default LanguageSelector;
