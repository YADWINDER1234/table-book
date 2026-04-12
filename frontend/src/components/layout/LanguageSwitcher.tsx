import React, { useState } from 'react';
import { supportedLanguages, setLanguage, getLanguage } from '../../utils/i18n';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = getLanguage();
  const currentLangName = supportedLanguages.find((l) => l.code === currentLang)?.name;

  const handleLanguageChange = (code: string) => {
    setLanguage(code as any);
    setIsOpen(false);
    // Reload page or update state as needed
    window.location.reload();
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
      >
        <span>🌐</span>
        <span>{currentLangName}</span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg z-50">
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`block w-full text-left px-4 py-2 ${
                lang.code === currentLang
                  ? 'bg-orange-600 text-white'
                  : 'hover:bg-gray-100'
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
