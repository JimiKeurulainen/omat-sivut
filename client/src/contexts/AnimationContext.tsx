import React, { createContext, useContext, useEffect, useState } from 'react';
import { DataContext } from './DataContext';
import LanguageContext from './LanguageContext';
import { PositionContext } from './PositionContext';
import { useNavigate } from 'react-router-dom';

interface ContextProps {
  children: React.ReactNode;
};

interface DataContextType {
  setAppRef: React.Dispatch<React.SetStateAction<any>>,
  navbarInit: number,
  activeCategory: number,
  setActiveCategory: React.Dispatch<React.SetStateAction<number>>,
}

export const AnimationContext = createContext<DataContextType>({
  setAppRef: () => {},
  navbarInit: -1,
  activeCategory: -1,
  setActiveCategory: () => {},
});

export function AnimationContextProvider({ children }: ContextProps) {
  const animDelay = 300;

  const [appRef, setAppRef] = useState<any>();
  const [navbarInit, setNavbarInit] = useState<number>(-1);
  const [activeCategory, setActiveCategory] = useState<number>(-1);
  
  const { data } = useContext(DataContext);
  const { language } = useContext(LanguageContext);

  // Trigger the initialization animation on page load
  useEffect(() => {
    if (appRef) {
      setTimeout(() => {
        setNavbarInit(0);
      }, animDelay);
    }
  }, [appRef]);

  // Trigger initialization animation on language change
  useEffect(() => {
    navbarInit !== -1 && setNavbarInit(-1);
    setTimeout(() => {
      setNavbarInit(0);
    }, animDelay);
  }, [language]);

  // Iterate through category animations recursively
  useEffect(() => {
    if (navbarInit > -1 && navbarInit < Object.keys(data[language]!).length) {
      setTimeout(() => {
        setNavbarInit(navbarInit + 1);
      }, animDelay);
    }
    else if (navbarInit > -1 && navbarInit === Object.keys(data[language]!).length) {
      const route = sessionStorage.getItem('route');

      if (route) {
        const routeArr = route.split('/');
        routeArr[1] && setTimeout(() => {
          setActiveCategory(Object.keys(data[routeArr[1]]).indexOf(routeArr[2]));
        }, animDelay);
      }
    }
  }, [navbarInit]);

  return (
    <AnimationContext.Provider value={{ setAppRef, navbarInit, activeCategory, setActiveCategory }}>
      {children}
    </AnimationContext.Provider>
  );
};
