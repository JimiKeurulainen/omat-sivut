import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiResponse, DataObject, LocaleObj, RouteObj } from '../types/types';
import { getRoutes } from '../api/routes';
import { mapRoutes } from '../utils/mapRoutes';
import LanguageContext from './LanguageContext';
import i18n from '../translations/i18n';

interface ContextProps {
  children: React.ReactNode;
};

interface DataContextType {
  data: DataObject;
  routes: Array<JSX.Element>;
  error: boolean;
  loading: boolean;
}

export const DataContext = createContext<DataContextType>({
  data: {},
  routes: [],
  error: false,
  loading: false,
});

export function DataContextProvider({ children }: ContextProps) {
  const [data, setData] = useState<DataObject>({});
  const [routes, setRoutes] = useState(Array<JSX.Element>);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    initRoutes();
  }, []);

  // useEffect(() => {
  //   // console.log('LANG', i18n.language, Object.keys(data).length, data[i18n.language.toUpperCase()]);
  //   (i18n.language && Object.keys(data).length > 0) && setLocalisedData(data[i18n.language.toUpperCase()]);
  // }, [data, i18n.language]);

  async function initRoutes() {
    setLoading(true);
    const response: ApiResponse = await getRoutes();

    if (response.error) {
      setError(true);
      setData({});
      setRoutes([]);
    }
    else if (!response.data) {
      setError(false);
      setData({});
      setRoutes([]);
    }
    else {
      setError(false);
      setRoutes(mapRoutes(response.data));
      setData(response.data);
    }
    setLoading(false);
  }

  return (
    <DataContext.Provider value={{ data, routes, error, loading }}>
      {children}
    </DataContext.Provider>
  );
};
