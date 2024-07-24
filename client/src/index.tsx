import React from 'react';
import ReactDOM from 'react-dom/client';
import './components/App.scss';
import reportWebVitals from './reportWebVitals';
import Root from './components/Root';
import { DataContextProvider } from './contexts/DataContext';
import { LanguageContextProvider  } from './contexts/LanguageContext';
import { BrowserRouter } from 'react-router-dom';
import { PositionContextProvider } from './contexts/PositionContext';
import './translations/i18n';
import { AnimationContextProvider } from './contexts/AnimationContext';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <DataContextProvider>
      <LanguageContextProvider>
      <PositionContextProvider>
      <AnimationContextProvider>
        <Root />
      </AnimationContextProvider>
      </PositionContextProvider>
      </LanguageContextProvider>
      </DataContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
