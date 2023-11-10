// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import HTMLContent from './HTMLContent';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Submenu from './Submenu';


interface CategoryObj {
  [key: string]: Array<string>
}
interface Props {
  element: CategoryObj,
  index: number,
  handleString: Function
}

function Category({element, index, handleString}: Props) {
  const navigateURL = useNavigate();

  const [categories, setCategories] = useState(Array<JSX.Element>);
  const [menuPos, setMenuPos] = useState(false);
  const [submenuStates, setSubmenuStates] = useState(Array<JSX.Element>);
  const [active, setActive] = useState(Array<boolean>);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCategories(Object.values(element)[0].map((project, index1) => {
      return (
        <button onClick={() => openSubCategory(project, index1)}>
          <FontAwesomeIcon icon={faCaretRight} />
          <p>{handleString(project)}</p>
          <div></div>
        </button>
      );
    }));
    setSubmenuStates(Object.values(element)[0].map(() => {
      return <br />;
    }));
  }, []);

  function openSubCategory(project: any, index: number) {
    setSubmenuStates(submenuStates => submenuStates.map((state, i) => {
      if (i === index && state.type === 'br') {
        return state = <Submenu category={Object.keys(element)[0]} subcategory={project}></Submenu>;
      }
      else if (i === index && state.type !== 'br') {
        return state = <br />
      }
      else {
        return state;
      }
    }));
  }

  return (
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
            {submenuStates.map((state, index) => {
            return (
              <div className='SubmenuContainer'>
                {categories[index]}
                {submenuStates[index]}
              </div>
            )})}
          </div>
        </CSSTransition>
        }
        <div className='CategoryHeader'>
          <button className='MenuButton' onClick={() => setMenuPos(menuPos => !menuPos)}>
            <FontAwesomeIcon icon={faBars}/>
          </button>
          <h2>{handleString(element)}</h2>
        </div>
        <div className='TextContainer'>
          <HTMLContent ID={handleString(element)}></HTMLContent>
          <div id='TextBG'></div>
        </div>
      </div>
    </Element>
  )
}

export default Category;
