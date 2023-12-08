import './LangSelect.scss';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useDataContext, useLanguageContext } from './Root';
import { useLocation, useNavigate } from 'react-router-dom';


function LangSelect() {
  const {language, setLanguage, setPreviousPath} = useLanguageContext();
  const langRef = useRef(null);
  const navigateURL = useNavigate();
  const location = useLocation();
  const data = useDataContext();

  const [disclaimer, setDisclaimer] = useState(false);

  // Set DeepL disclaimer message visibility based on location
  useEffect(() => {
    const pathArray = location.pathname.split('/');

    if (pathArray.length === 2) {
      setDisclaimer(false);
    }
    else {
      language === 'EN' ? setDisclaimer(true) : setDisclaimer(false);
    }
  }, [language, location]);

  // Make this interaction into a function instead of useEffect
  // to avoid navigateURL from being triggered on language state mount
  function changeLanguage() {
    const toggleLang = language === 'FI' ? 'EN' : 'FI';
    setLanguage(toggleLang);

    // Reconstruct file path indexes to navigate to the other language's equivalent path
    const previousPathComponents = location.pathname.split('/');
    var tempPath: Array<string> = [];

    data.forEach(category => {
      if (Object.keys(category)[0].slice(2) === previousPathComponents[2]) {
        tempPath.push(Object.keys(category)[0].split('_')[0]);

        if (Object.values(category)[0].length !== 0) {
          Object.values(category)[0].forEach(subcategory => {
  
            if (Object.keys(subcategory)[0].slice(2) === previousPathComponents[3]) {
              tempPath.push(Object.keys(subcategory)[0].split('_')[0]);
  
              Object.values(subcategory)[0].forEach(file => {
                encodeURIComponent(file.slice(2)) === previousPathComponents[4] && tempPath.push(file.split('_')[0]);
              })
            }
          });
        }
      }
    });
    // console.log('tempPath', tempPath);
    tempPath.length !== 0 && setPreviousPath(tempPath);
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
        { disclaimer && 
          <div className='Disclaimer'>
            <small>English documents are translated with</small>
            <img src='https://static.deepl.com/img/press/logo_DeepL.svg' />
          </div>
        }
      </div>
    </CSSTransition>
  )
}

export default LangSelect;
