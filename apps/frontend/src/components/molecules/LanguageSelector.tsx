import type React from 'react';
import { TagsOfSupportedLanguages } from '@pxa-re-management/shared';
import { useLanguage } from '@/store/languageSettings.ts';


const LanguageSelector: React.FC = (): React.ReactNode => {

  const { currentLanguage, changeLanguage } = useLanguage();

  const handleLanguageChange = (language: TagsOfSupportedLanguages) => {
    changeLanguage(language);
  };

  return (
    <div className="relative">
      <select
        value={currentLanguage}
        onChange={(e) => handleLanguageChange(e.target.value as TagsOfSupportedLanguages)}
        className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {
          Object.values(TagsOfSupportedLanguages).map(
            (languageTag: TagsOfSupportedLanguages): React.ReactNode => (
              <option
                key={ languageTag }
                value={ languageTag }
              >
                {
                  ((): string => {
                    switch (languageTag) {
                      case TagsOfSupportedLanguages.japanese: return "日本語";
                      case TagsOfSupportedLanguages.english: return "English";
                      case TagsOfSupportedLanguages.chinese: return "中文";
                    }
                  })()
                }
              </option>
            ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};


export default LanguageSelector;
