// import './App.css';
import './App.scss';
import { useEffect, useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import App from './App';
import ErrorPage from './ErrorPage';
import Status from './Status';
import { DataContext } from '../contexts/DataContext';


function Root() {
  const { routes } = useContext(DataContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (routes && Object.keys(routes).length > 0) {
      const route = sessionStorage.getItem('route');
      route && navigate(route);
    }
  }, [routes]);

  useEffect(() => {
    const locationArr = location.pathname.split('/');
    locationArr.length > 0 && sessionStorage.setItem('route', location.pathname);
  }, [location]);

  return (
    <Routes>
      <Route path='*' element={<ErrorPage />} />
      <Route path='/status' element={<Status />}/>
      <Route path='/' element={<App />}>
        {Object.keys(routes).length > 0 && routes}
      </Route>
    </Routes>
  )
}

export default Root;
