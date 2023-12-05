import './LangSelect.scss';
import { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLanguageContext } from './Root';
import { useLocation, useNavigate } from 'react-router-dom';


function LangSelect() {
  const {language, setLanguage} = useLanguageContext();
  const langRef = useRef(null);
  const navigateURL = useNavigate();
  const location = useLocation();

  // Make this interaction into a function instead of useEffect
  // to avoid navigateURL from being triggered on language state mount
  function changeLanguage() {
    const toggleLang = language === 'FI' ? 'EN' : 'FI';
    setLanguage(toggleLang);
    navigateURL('/' + toggleLang);
    console.log(location.pathname);
  }

  return (
    <CSSTransition
    nodeRef={langRef}
    in={language === 'EN'}
    timeout={0}
    classNames="LangSelect"
    >
      <div className='LangSelect' ref={langRef} onClick={changeLanguage}>
        <p>FI</p>
        <span><div /></span>
        <p>EN</p>
      </div>
    </CSSTransition>
  )
}

export default LangSelect;
