import './LangSelect.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LanguageContext from '../contexts/LanguageContext';
import { DataContext } from '../contexts/DataContext';


function LangSelect() {
  const {language, handleLanguageChange, setPreviousPath} = useContext(LanguageContext);
  const langRef = useRef(null);
  const disclaimerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isMobile = useMediaQuery({query: '(max-width: 600px)'});

  const [disclaimer, setDisclaimer] = useState(false);

  // Set DeepL disclaimer message visibility based on location
  useEffect(() => {
    const pathArray = location.pathname.split('/');

    if (pathArray.length === 2 || isMobile) {
      setDisclaimer(false);
    }
    else {
      language === 'EN' ? setDisclaimer(true) : setDisclaimer(false);
    }
  }, [language, location]);

  // Add animation class to disclaimer when it is mounted on mobile view
  useEffect(() => {
    if (isMobile) {
      disclaimer && setTimeout(() => {
        disclaimerRef.current && disclaimerRef.current.classList.add('Fade')
      }, 100);
    }
  }, [disclaimer]);

  // Make this interaction into a function instead of useEffect
  // to avoid navigateURL from being triggered on language state mount
  function changeLanguage() {
    const toggleLang = language === 'FI' ? 'EN' : 'FI';
    handleLanguageChange(toggleLang);
  }

  //   // Reconstruct file path indexes to navigate to the other language's equivalent path
  //   const previousPathComponents = location.pathname.split('/');
  //   var tempPath: Array<string> = [];

  //   localisedData.forEach(category => {
  //     if (Object.keys(category)[0].slice(2) === previousPathComponents[2]) {
  //       tempPath.push(Object.keys(category)[0].split('_')[0]);

  //       if (Object.values(category)[0].length !== 0) {
  //         Object.values(category)[0].forEach(subcategory => {
  
  //           if (Object.keys(subcategory)[0].slice(2) === previousPathComponents[3]) {
  //             tempPath.push(Object.keys(subcategory)[0].split('_')[0]);
  
  //             Object.values(subcategory)[0].forEach(file => {
  //               encodeURIComponent(file.slice(2)) === previousPathComponents[4] && tempPath.push(file.split('_')[0]);
  //             })
  //           }
  //         });
  //       }
  //     }
  //   });
  //   tempPath.length !== 0 && setPreviousPath(tempPath[0]);
  // }

  return (
    <CSSTransition
    nodeRef={langRef}
    in={language === 'EN'}
    timeout={0}
    classNames="LangSelect"
    >
      <div className='LangSelect' ref={langRef}>
        <p>FI</p>
        <span onClick={changeLanguage}><div /></span>
        <p>EN</p>
        { isMobile && language === 'EN' && location.pathname.split('/').length !== 2 &&
          <FontAwesomeIcon icon={faInfoCircle} onClick={() => setDisclaimer(disclaimer => !disclaimer)} />
        }
        { disclaimer && 
          <div className='Disclaimer' ref={disclaimerRef}>
            <small>English documents are translated with</small>
            <img src='https://static.deepl.com/img/press/logo_DeepL.svg' />
          </div>
        }
      </div>
    </CSSTransition>
  )
}

export default LangSelect;
