// import './App.css';
import './App.scss';
import { useEffect, useState, useContext, createContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import App from './App';
import ErrorPage from './ErrorPage';
import Status from './Status';
import { ApiResponse, LanguageObj, LocaleObj, RouteObj } from '../types/types';
import { mapRoutes } from '../utils/mapRoutes';
import { getRoutes } from '../api/routes';
import { DataContext } from '../contexts/DataContext';
import i18n from '../translations/i18n';
import LanguageContext from '../contexts/LanguageContext';


// export function handleString(string: string) {
//   // Check string attribute data type and slice the order prefix
//   const str = typeof string !== 'string' ? Object.keys(string)[0].slice(2) : string.slice(2);
//   // Capitalize the first letter of the string
//   const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
//   // Replace underlines with white space and return string
//   return capitalized.replace(/_/g, ' ');
// }

function Root() {
  const { routes } = useContext(DataContext);
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (routes && Object.keys(routes).length > 0) {
      const route = sessionStorage.getItem('route');
      console.log('ROUTE', route);

      route && navigate(route);
    }
  }, [routes]);

  useEffect(() => {
    const locationArr = location.pathname.split('/');
    console.log('LOCATION', location, locationArr);
    locationArr.length > 0 && sessionStorage.setItem('route', location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path='*' element={<ErrorPage />} />
      <Route path='/status' element={<Status />}/>
      <Route path='/' element={<App />}>
      {/* <Redirect from='' to={i18n.language} /> */}
        {Object.keys(routes).length > 0 && routes}
      </Route>
    </Routes>
  )
}

export default Root;
