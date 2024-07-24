import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Events, scroller } from 'react-scroll';

interface ContextProps {
  children: React.ReactNode;
};

interface DataContextType {
  vertical: boolean;
  horizontal: number;
  error: boolean;
  loading: boolean;
}

export const PositionContext = createContext<DataContextType>({
  vertical: false,
  horizontal: 0,
  error: false,
  loading: false,
});

export function PositionContextProvider({ children }: ContextProps) {
  const [vertical, setVertical] = useState<boolean>(false);
  const [horizontal, setHorizontal] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    handleScroll();
  }, [location]);

  // useEffect(() => {
  //   const locationArr = location.pathname.split('/');
  //   vertical ? scrollToElem(`category${locationArr[2]}`) : scrollToElem('Upper');
  // }, [vertical]);

  async function handleScroll() {
    const locationArr = location.pathname.split('/');
    console.log('LOCATION ARR', locationArr, location.pathname);

    if (locationArr.length > 2) {
      setVertical(true);
      !vertical && await scrollVertically('Lower');
      scrollHorizontally(`category${locationArr[2]}`);
    }
    else {
      setVertical(false);
      scrollVertically('Upper');
    }
  }

  async function scrollHorizontally(target: string) {
    scroller.scrollTo(target, {
      duration: 500,
      delay: 0,
      smooth: true,
      containerId: 'Lower',
      horizontal: true
    });
  }
 
  async function scrollVertically(target: string) {
    scroller.scrollTo(target, {
      duration: 1000,
      delay: 0,
      smooth: true
    });
  }

  return (
    <PositionContext.Provider value={{ error, loading, vertical, horizontal }}>
      {children}
    </PositionContext.Provider>
  );
};
