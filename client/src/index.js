import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/App.scss';
import App from './components/App';
import ErrorPage from './components/ErrorPage';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    children: [
      {path: '', element: <App />},
      {path: 'tietoa_minusta', element: <App />},
      {path: 'projektini', element: <App />},
      {path: 'kanavani', element: <App />}
    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
