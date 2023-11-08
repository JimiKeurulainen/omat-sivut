// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';


interface CategoryObj {
  [key: string]: Array<string>
}
interface Props {
  element: CategoryObj,
  index: number,
  handleString: Function
}

function Category({element, index, handleString}: Props) {
  const [projects, setProjects] = useState(Array<JSX.Element>);
  const [menuPos, setMenuPos] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tempArr: Array<JSX.Element> = [];
    Object.values(element)[0].forEach(project => {
      tempArr.push(
        <button key={`menu_${project}`}>
          <p>{handleString(project)}</p>
          <div></div>
        </button>
      )
    });
    setProjects(tempArr);
  }, []);

  // useEffect(() => {
  //   menuPos ? menuRef.current?.classList.add('MenuActive') : menuRef.current?.classList.remove('MenuActive');
  // }, [menuPos])

  return (
    <Element name={`category${index}`} className='CategoryContainer'>
      <div className='Category'>
        {projects.length !== 0 &&
        <CSSTransition
        nodeRef={menuRef}
        in={menuPos}
        timeout={500}
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
          <div id='TextBG'></div>
        </div>
      </div>
    </Element>
  )
}

export default Category;
