// import './App.css';
import './App.scss';
import { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import ErrorPage from './ErrorPage';


interface LocaleObj {
  [key: string]: Array<RouteObj>
}
interface RouteObj {
  [key: string]: Array<SubRouteObj>
}
interface SubRouteObj {
  [key: string]: Array<string>
}

interface LanguageObj {
  language: string,
  setLanguage: Function,
  previousPath: Array<string>,
  setPreviousPath: Function
}

export function handleString(string: any) {
  // Check string attribute data type and slice the order prefix
  const str = typeof string !== 'string' ? Object.keys(string)[0].slice(2) : string.slice(2);
  // Capitalize the first letter of the string
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  // Replace underlines with white space and return string
  return capitalized.replace(/_/g, ' ');
}

const DataContext = createContext<Array<RouteObj>>([{default: [{default1: ['default']}]}]);
export const useDataContext = () => useContext(DataContext);

const LanguageContext = createContext<LanguageObj>({language: 'FI', setLanguage() {}, previousPath: ['null'], setPreviousPath() {}});
export const useLanguageContext = () => useContext(LanguageContext);

function Root() {
  const [data, setData] = useState(Array<LocaleObj>);
  const [localisedData, setLocalisedData] = useState(Array<RouteObj>);
  const [language, setLanguage] = useState<string>('FI');
  const [previousPath, setPreviousPath] = useState<Array<string>>(['null'])
  const [routes, setRoutes] = useState(Array<JSX.Element>);

  useEffect(() => {
    const routesURL = process.env.REACT_APP_ROUTES ? process.env.REACT_APP_ROUTES : 'no env route';

    // Create routes based on server's content directory structure 
    axios.get(routesURL).then(res => {
      setRoutes(res.data.map((locale: LocaleObj) => {
        
        // Map locales
        return (<Route path={Object.keys(locale)[0]} element={<App />} key={'locale' + locale}>
          {Object.values(locale)[0].map((route: RouteObj) => {

          // Map main routes
          return (<Route path={Object.keys(route)[0].slice(2)} element={<App />} key={'route' + route}>
            {Object.values(route)[0].length > 0 && Object.values(route)[0].map((subroute: SubRouteObj) => {

              // Map subroutes
              if (Object.values(subroute)) {
                return (<Route path={Object.keys(subroute)[0].slice(2)} element={<App />} key={'subroute' + subroute}>
                  {Object.values(subroute)[0].length > 0 && Object.values(subroute)[0].map((file: string) => {

                    // Map files
                    return <Route path={file.slice(2)} element={<App />} key={'fileRoute' + file} />
                  })}
                </Route>);
              }
              else {
                return null;
              }
            })}
          </Route>)
        })}
        </Route>)
      }));
      // Set data context to be the same directory structure
      // Mainly used to create get-request URLs to the API
      setData(res.data);
    });
  }, []);

  useEffect(() => {
    data.forEach(locale => {
      Object.keys(locale)[0] === language && setLocalisedData(Object.values(locale)[0]);
    });
  }, [language, data]);

  return (
    <LanguageContext.Provider value={{language, setLanguage, previousPath, setPreviousPath}}>
    <DataContext.Provider value={localisedData}>
      <BrowserRouter>
          <Routes>
            <Route path='*' element={<ErrorPage />} />
            <Route path='/' element={<App />}>
              {routes}
            </Route>
          </Routes>
      </BrowserRouter>
    </DataContext.Provider>
    </LanguageContext.Provider>
  )
}

export default Root;
