// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import HTMLContent from './HTMLContent';
import { useNavigate, useParams } from 'react-router-dom';


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
  const { params } = useParams();

  const [projects, setProjects] = useState(Array<JSX.Element>);
  const [activeProject, setActiveProject] = useState('');
  const [menuPos, setMenuPos] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tempArr: Array<JSX.Element> = [];
    Object.values(element)[0].forEach(project => {
      tempArr.push(
        <div className='SubmenuContainer'>
          <button key={`menu_${project}`} onClick={() => openSubCategory(project)}>
            <FontAwesomeIcon icon={faCaretRight} />
            <p>{handleString(project)}</p>
            <div></div>
          </button>
          <div className='Submenu'>
            
          </div>
        </div>
      )
    });
    setProjects(tempArr);
  }, []);

  function openSubCategory(category: any) {
    console.log(category, params);
    navigateURL('/' + Object.keys(element)[0].slice(2));
    setActiveProject(category);
  }

  return (
    <Element name={`category${index}`} className='CategoryContainer'>
      <div className='Category'>
        {projects.length !== 0 &&
        <CSSTransition
        nodeRef={menuRef}
        in={menuPos}
        timeout={0}
        classNames="Menu">
          <div ref={menuRef} className='Menu'>
            <h3>Kategoriat</h3>
            {projects}
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
