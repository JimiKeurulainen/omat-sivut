// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState, useRef, createContext, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import HTMLContent from './HTMLContent';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleString } from './Root';
import Submenu from './Submenu';


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
  const navigateURL = useNavigate();
  const location = useLocation();

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
          <Submenu baseRoute={Object.keys(element)[0]} data={project} index={index1} activeHTML={activeHTML} setActiveHTML={setActiveHTML}></Submenu>
        </div>
      );
    }));
    setSubmenuStates(Object.values(element)[0].map(() => {
      return false;
    }));
  }, []);

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

  return (
    <StateContext.Provider value={submenuStates}>
      <Element name={`category${index}`} className='CategoryContainer'>
        <div className='Category'>
          {categories.length !== 0 &&
          <CSSTransition
            nodeRef={menuRef}
            in={menuPos}
            timeout={0}
            classNames="Menu"
          >
            <div ref={menuRef} className='Menu'>
              <h3>Kategoriat</h3>
              {categories}
            </div>
          </CSSTransition>
          }
          <div className='CategoryHeader'>
            <button className='MenuButton' onClick={() => setMenuPos(menuPos => !menuPos)}>
              <FontAwesomeIcon icon={faBars}/>
            </button>
            <h2>{handleString(Object.keys(element)[0])}</h2>
          </div>
          <div className='TextContainer'>
            {activeHTML !== '' && activeComp}
            <div id='TextBG'></div>
          </div>
        </div>
      </Element>
    </StateContext.Provider>
  )
}

export default Category;
