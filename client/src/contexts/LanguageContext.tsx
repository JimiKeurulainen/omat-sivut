import React, { createContext, useContext, useEffect, useState } from 'react';
import i18next from '../translations/i18n';
import { useLocation, useNavigate } from 'react-router-dom';
import { DataContext } from './DataContext';

interface ContextProps {
  children: React.ReactNode;
};

interface LanguageContextType {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  previousLanguage: string;
  handleLanguageChange: Function;
  previousPath: string;
  setPreviousPath: React.Dispatch<React.SetStateAction<string>>
}

export const LanguageContext = createContext<LanguageContextType>({
  language: '',
  setLanguage: () => {},
  previousLanguage: '',
  handleLanguageChange: () => {},
  previousPath: '',
  setPreviousPath: () => {},
});

export function LanguageContextProvider({ children }: ContextProps) {
  const [language, setLanguage] = useState<string>('FI');
  const [previousLanguage, setPreviousLanguage] = useState<string>('EN');
  const [previousPath, setPreviousPath] = useState<string>('');

  const { data } = useContext(DataContext);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lang = localStorage.getItem('language');
    lang && setLanguage(lang);
  }, []);

  function handleLanguageChange(lang: string) {
    setPreviousLanguage(language);
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    const routeArr = location.pathname.split('/').filter(step => step !== '');
    routeArr.splice(0, 1);
    let route = '/' + lang;
    if (routeArr.length > 0 && Object.keys(data).length > 0) {
      let currentObj: any = data[i18next.language.toUpperCase()];
      const indices = [];
  
      for (const step of routeArr) {
        const index = Object.keys(currentObj).indexOf(step);
        indices.push(index);
        currentObj = currentObj[step];
      }

      i18next.changeLanguage(lang.toLowerCase());
      currentObj = data[lang];

      for (const index of indices) {
        route += '/' + Object.keys(currentObj)[index];
      }
    }
    else {
      i18next.changeLanguage(lang.toLowerCase());
      route = '/' + lang;
    }
    navigate(route);
  }

  return (
    <LanguageContext.Provider value={{language, setLanguage, previousLanguage, handleLanguageChange, previousPath, setPreviousPath}}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;