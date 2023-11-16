// import './App.css';
import './App.scss';
import { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import ErrorPage from './ErrorPage';


interface RouteObj {
  [key: string]: {
    [key: string]: Array<string>
  }
}
interface SubRouteObj {
  [key: string]: Array<string>
}

export function handleString(string: any) {
  // Check string attribute data type and slice the order prefix
  const str = typeof string !== 'string' ? Object.keys(string)[0].slice(2) : string.slice(2);
  // Capitalize the first letter of the string
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  // Replace underlines with white space and return string
  return capitalized.replace(/_/g, ' ');
}

const DataContext = createContext<Array<RouteObj>>([{default: {default1: ['default']}}]);
export const useDataContext = () => useContext(DataContext);

function Root() {
  const routesURL = process.env.REACT_APP_ROUTES ? process.env.REACT_APP_ROUTES : 'no env variable';
  
  const [data, setData] = useState(Array<RouteObj>);
  const [routes, setRoutes] = useState(Array<JSX.Element>);

  useEffect(() => {
    // Create routes based on server's content directory structure 
    axios.get(routesURL).then(res => {
      // Map main routes
      setRoutes(res.data.map((route: RouteObj) => {
        return (<Route path={Object.keys(route)[0].slice(2)} element={<App />} key={'route' + route}>
          {Object.values(route).map((subroute: SubRouteObj, i2: number) => {
            
            // Map subroutes
            if (Object.values(subroute).length > 0) {
              return (<Route path={Object.keys(subroute[i2])[0].slice(2)} element={<App />} key={'subroute' + subroute}>
                {Object.values(subroute[i2]).map((file: string, i3: number) => {

                  // Map files
                  if (file.length > 0) {
                    return <Route path={file[i3].slice(2)} element={<App />} key={'fileRoute' + file[i3]} />
                  }
                  else {
                    return null;
                  }
                })}
              </Route>);
            }
            else {
              return null;
            }
          })}
        </Route>)
      }));
      // Set data context to be the same directory structure
      // Mainly used to create get-request URLs to the API
      setData(res.data);
    });
  }, []);

  // useEffect(() => {
  //   console.log('routes', routes);
  // }, [routes]);

  return (
    <DataContext.Provider value={data}>
      <BrowserRouter>
          <Routes>
            <Route path='*' element={<ErrorPage />} />
            <Route path='/' element={<App />}>
              {routes}
            </Route>
          </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  )
}

export default Root;
