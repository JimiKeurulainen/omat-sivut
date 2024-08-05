// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState, useRef, createContext, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import HTMLContent from './HTMLContent';
import Submenu from './Submenu';
import { useMediaQuery } from 'react-responsive';
import LangSelect from './LangSelect';
import { RouteObj } from '../types/types';
import LanguageContext from '../contexts/LanguageContext';
import { DataContext } from '../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import SlideParagraph from './text/SlideParagraph';
import { AnimationContext } from '../contexts/AnimationContext';

interface Props {
  element: RouteObj,
  index: number,
}

const StateContext = createContext([false]);
export const useStateContext = () => useContext(StateContext);

function Category({element, index}: Props) {
  const isMobile = useMediaQuery({query: '(max-width: 600px)'});
  const { language } = useContext(LanguageContext);
  const { data } = useContext(DataContext);
  const { navbarInit } = useContext(AnimationContext);
  const { t } = useTranslation();

  const [menuPos, setMenuPos] = useState(false);
  const [submenuStates, setSubmenuStates] = useState(Array<boolean>);
  const [activeHTML, setActiveHTML] = useState('');
  const [activeComp, setActiveComp] = useState<JSX.Element | null>(null);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSubmenuStates(Object.values(element).map(() => {
      return false;
    }));
  }, [element]);

  useEffect(() => {
    setActiveComp(<HTMLContent ID={activeHTML}></HTMLContent>)
  }, [activeHTML]);

  function onscroll(event: any) {
    console.log('scroll', event);
  }

  return (
    <StateContext.Provider value={submenuStates}>
      <Element 
        name={`category${Object.keys(data[language])[index]}`} 
        className='CategoryContainer'
      >
        <div className='Category' onScroll={(e) => onscroll(e)}>
          {Object.keys(element).length !== 0 &&
          <CSSTransition
            nodeRef={menuRef}
            in={menuPos}
            timeout={isMobile ? 200 : 0}
            classNames="Menu"
            key={`category${Object.keys(data[language])[index]}`}
          >
            <div ref={menuRef} className='Menu'>
              <h3>{t('categories')}</h3>
              {Object.values(element).map((subcategory: any, index1: number) => {
                return (
                  <Submenu 
                    key={'subcategory' + Object.keys(element)[index1]}
                    baseRoute={Object.keys(data[language])[index]} 
                    title={Object.keys(element)[index1]}
                    data={subcategory}
                    // openMenu={() => openSubCategory(index1)}
                    index={index1} 
                    setMenu={setMenuPos} 
                    setActiveHTML={setActiveHTML}
                  />
                );
              })}
            </div>
          </CSSTransition>
          }
          <div className='CategoryHeader'>
            <button className='MenuButton' onClick={() => setMenuPos(menuPos => !menuPos)}>
              <FontAwesomeIcon icon={faBars}/>
            </button>
            <h2>
              <SlideParagraph 
                triggerAnim={navbarInit >= index} 
                translatable={''}
                indices={[index]} 
              />
            </h2>
            {isMobile && <div className='LangContainer'>
            <LangSelect />
          </div>}
          </div>
          <div className='TextContainer'>
            <svg width="100%" height="100%" viewBox='0 0 100 100' preserveAspectRatio='none'>
            <rect
              className='TextLoading'
              id="rect1516"
              width="1000"
              height="1000"
              x="1"
              y="1"
              ry="20" 
            />
            </svg>
            {activeHTML !== '' && activeComp}
            <div id='TextBG'></div>
          </div>
          {!isMobile && <div className='LangContainer'>
            <LangSelect />
          </div>}
        </div>
      </Element>
    </StateContext.Provider>
  )
}

export default Category;
