import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language, LocalizedString } from '../types';
import { UI_STRINGS } from '../constants';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  translate: (localizedString: LocalizedString) => string;
  translateUI: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'te' : 'en'));
  };

  const translate = (localizedString: LocalizedString) => {
    return localizedString[language];
  };
  
  // FIX: The require call was replaced with an ES module import at the top of the file to fix the 'Cannot find name 'require'' error.
  const translateUI = (key: string) => {
    return UI_STRINGS[key] ? UI_STRINGS[key][language] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, translate, translateUI }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
