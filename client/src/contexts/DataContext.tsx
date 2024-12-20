import React, { createContext, useEffect, useState } from 'react';
import { ApiResponse, DataObject } from '../types/types';
import { getRoutes } from '../api/routes';
import { mapRoutes } from '../utils/mapRoutes';

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
