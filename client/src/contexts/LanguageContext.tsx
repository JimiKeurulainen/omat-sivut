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
  handleLanguageChange: Function;
  previousPath: string;
  setPreviousPath: React.Dispatch<React.SetStateAction<string>>
}

export const LanguageContext = createContext<LanguageContextType>({
  language: '',
  setLanguage: () => {},
  handleLanguageChange: () => {},
  previousPath: '',
  setPreviousPath: () => {},
});

export function LanguageContextProvider({ children }: ContextProps) {
  const [language, setLanguage] = useState<string>('FI');
  const [previousPath, setPreviousPath] = useState<string>('');
  const [equivalentPath, setEquivalentPath] = useState('');
  const { data } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lang = localStorage.getItem('language');
    console.log('LANG', language, lang);
    lang && setLanguage(lang);
  }, []);

  function handleLanguageChange(language: string) {
    setLanguage(language);
    localStorage.setItem('language', language);
    
    const routeArr = location.pathname.split('/').filter(step => step !== '');
    routeArr.splice(0, 1);
    let route = '/' + language;
    if (routeArr.length > 0 && Object.keys(data).length > 0) {
      let currentObj: any = data[i18next.language.toUpperCase()];
      const indices = [];
  
      for (const step of routeArr) {
        const index = Object.keys(currentObj).indexOf(step);
        indices.push(index);
        currentObj = currentObj[step];
      }

      i18next.changeLanguage(language.toLowerCase());
      currentObj = data[language];

      for (const index of indices) {
        route += '/' + Object.keys(currentObj)[index];
      }
    }
    else {
      i18next.changeLanguage(language.toLowerCase());
      route = '/' + language;
    }
    navigate(route);
  }

  return (
    <LanguageContext.Provider value={{language, setLanguage, handleLanguageChange, previousPath, setPreviousPath}}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;