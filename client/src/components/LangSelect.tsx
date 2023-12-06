import './LangSelect.scss';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { handleString, useDataContext, useLanguageContext } from './Root';
import { useLocation, useNavigate } from 'react-router-dom';


function LangSelect() {
  const {language, setLanguage} = useLanguageContext();
  const langRef = useRef(null);
  const navigateURL = useNavigate();
  const location = useLocation();
  const data = useDataContext();

  const [prevLang, setPrevLang] = useState('');
  const [prevLangPath, setPrevLangPath] = useState(['']);

  useEffect(() => {
    // Reconstruct file path to navigate to the other language's equivalent path
    if (prevLang && language !== prevLang) {
      var tempPath: string = '/' + language;
      console.log('langsel', language, data, prevLangPath, prevLang);


      data.forEach(category => {
        if (Object.keys(category)[0].split('_')[0] === prevLangPath[0]) {
          tempPath += '/' + Object.keys(category)[0].slice(2);

          if (prevLangPath.length > 1) {
            Object.values(category)[0].forEach(subcategory => {
              if (Object.keys(subcategory)[0].split('_')[0] === prevLangPath[1]) {
                tempPath += '/' + Object.keys(subcategory)[0].slice(2);

                Object.values(subcategory)[0].forEach(file => {
                  file.split('_')[0] === prevLangPath[2] && (tempPath += '/' + file.slice(2));
                });
              }
            });
          }
        }
      });
      prevLang && navigateURL(tempPath);
    }

  }, [data]);

  // Make this interaction into a function instead of useEffect
  // to avoid navigateURL from being triggered on language state mount
  function changeLanguage() {
    const toggleLang = language === 'FI' ? 'EN' : 'FI';
    setLanguage(toggleLang);
    setPrevLang(language);

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
    tempPath.length !== 0 && setPrevLangPath(tempPath);
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
