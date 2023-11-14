// import './App.css';
import './App.scss';
import { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import App from './App';


interface RouteObj {
  [key: string]: {
    [key: string]: Array<string>
  }
}
interface SubRouteObj {
  [key: string]: Array<string>
}

export function handleString(string: any) {
  // console.log('handlestring', string);
  // Check string attribute data type and slice the order prefix
  // if (string.length === 0) {
  //   return '';
  // }
  const str = typeof string !== 'string' ? Object.keys(string)[0].slice(2) : string.slice(2);
  // Capitalize the first letter of the string
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  // Replace underlines with white space and return string
  return capitalized.replace(/_/g, ' ');
}

const DataContext = createContext<Array<RouteObj>>([{default: {default1: ['default']}}]);
export const useDataContext = () => useContext(DataContext);

function Root() {
  const [data, setData] = useState(Array<RouteObj>)
  const [routes, setRoutes] = useState(Array<JSX.Element>);

  useEffect(() => {
    axios.get('http://jimikeurulainen.site/content/routes').then(res => {
      console.log('res', res);
      setRoutes(res.data.map((route: RouteObj, i1: number) => {
        return (<Route path={Object.keys(route)[0].slice(2)} element={<App />} key={'route'+route}>
          {Object.values(route).map((subroute: SubRouteObj, i2: number) => {
            if (Object.values(subroute).length > 0) {
              return <Route path={Object.keys(subroute)[0].slice(2)} element={<App />} key={'subroute'+subroute}></Route>;
            }
            else {
              return null;
            }
          })}
        </Route>)
      }));
      setData(res.data);
    });
  }, []);

  return (
    <DataContext.Provider value={data}>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}>
              {routes}
            </Route>
          </Routes>
      </BrowserRouter>
    </DataContext.Provider>
  )
}

export default Root;
