// import './App.css';
import axios from 'axios';
import './Header.scss';
import { useEffect, useState, useRef, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLanguageContext } from './Root';


function Header() {
  const url = process.env.REACT_APP_FILES_EN ? process.env.REACT_APP_FILES_EN : 'no env variable';
  const {language, setLanguage} = useLanguageContext();
  const langRef = useRef(null);

  return (
      <header className='Header'>
        <h1>Jimi Keurulainen</h1>
        <CSSTransition
        nodeRef={langRef}
        in={language === 'EN'}
        timeout={0}
        classNames="LangSelect"
        >
          <div className='LangSelect' ref={langRef} onClick={() => setLanguage(language === 'FI' ? 'EN' : 'FI')}>
            <p>FI</p>
            <span><div /></span>
            <p>EN</p>
          </div>
        </CSSTransition>
      </header>
  )
}

export default Header;
