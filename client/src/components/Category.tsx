// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState, useRef, createContext, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import HTMLContent from './HTMLContent';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleString, useLanguageContext } from './Root';
import Submenu from './Submenu';
import { useMediaQuery } from 'react-responsive';
import LangSelect from './LangSelect';


interface CategoryObj {
  [key: string]: {
    [key: string]: any
  }
}
interface Props {
  element: CategoryObj,
  index: number,
}

const StateContext = createContext([false]);
export const useStateContext = () => useContext(StateContext);

function Category({element, index}: Props) {
  const isMobile = useMediaQuery({query: '(max-width: 600px)'});
  const {language} = useLanguageContext();
  const location = useLocation();
  const navigateURL = useNavigate();

  const [categories, setCategories] = useState(Array<JSX.Element>);
  const [menuPos, setMenuPos] = useState(false);
  const [submenuStates, setSubmenuStates] = useState(Array<boolean>);
  const [activeHTML, setActiveHTML] = useState('');
  const [activeComp, setActiveComp] = useState<JSX.Element | null>(null);
  
  const submenuRefs = useRef<Array<HTMLDivElement>>(new Array<HTMLDivElement>);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategories(Object.values(element)[0].map((project: CategoryObj, index1: number) => {
      return (
        <div className='SubmenuContainer' ref={(el: HTMLDivElement) => submenuRefs.current[index1] = el} key={'subcontainer'+index1}>
          <button onClick={() => openSubCategory(project, index1)}>
            <FontAwesomeIcon icon={faCaretRight} />
            <p>{handleString(Object.keys(project)[0])}</p>
            <div></div>
          </button>
          <Submenu baseRoute={Object.keys(element)[0]} data={project} index={index1} setMenu={setMenuPos} setActiveHTML={setActiveHTML}></Submenu>
        </div>
      );
    }));
    setSubmenuStates(Object.values(element)[0].map(() => {
      return false;
    }));
  }, [element]);

  useEffect(() => {
    setActiveComp(<HTMLContent ID={activeHTML}></HTMLContent>)
  }, [activeHTML]);

  function openSubCategory(project: any, index: number) {
    setSubmenuStates(submenuStates => submenuStates.map((state: boolean, i: number) => {
      if (i === index) {
        if (submenuRefs.current[i].classList.contains('Active')) {
          submenuRefs.current[i].classList.remove('Active');
        }
        else {
          submenuRefs.current[i].classList.add('Active');
        }
        return !state;
      }
      else {
        return state;
      }
    }));
  }

  function onscroll(event: any) {
    console.log('scroll', event);
  }

  return (
    <StateContext.Provider value={submenuStates}>
      <Element name={`category${index}`} className='CategoryContainer'>
        <div className='Category' onScroll={(e) => onscroll(e)}>
          {categories.length !== 0 &&
          <CSSTransition
            nodeRef={menuRef}
            in={menuPos}
            timeout={isMobile ? 200 : 0}
            classNames="Menu"
          >
            <div ref={menuRef} className='Menu'>
              <h3>{language === 'FI' ? 'Kategoriat' : 'Categories'}</h3>
              {categories}
            </div>
          </CSSTransition>
          }
          <div className='CategoryHeader'>
            <button className='MenuButton' onClick={() => setMenuPos(menuPos => !menuPos)}>
              <FontAwesomeIcon icon={faBars}/>
            </button>
            <h2>{handleString(Object.keys(element)[0])}</h2>
            {isMobile && <div className='LangContainer'>
            <LangSelect />
          </div>}
          </div>
          <div className='TextContainer'>
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
