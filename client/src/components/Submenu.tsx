// import './App.css';
import './Submenu.scss';
import { useEffect, useState, useRef, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useStateContext } from './Category';
import { handleString } from './Root';
import { useNavigate, useLocation } from 'react-router-dom';


interface CategoryObj {
  [key: string]: {
    [key: string]: any
  }
}
interface Props {
  baseRoute: string,
  data: CategoryObj,
  index: number,
  activeHTML: string,
  setActiveHTML: Function
}

function Submenu(props: Props) {
  const navigateURL = useNavigate();
  const location = useLocation();

  // const [location, setLocation]
  const [submenu, setSubmenu] = useState(Array<JSX.Element>);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);
  const state = useStateContext();

  useEffect(() => {
    setSubmenu(Object.values(props.data)[0].map((project: string) => {
      return (
      <button ref={buttonRef} key={'projectBtn'+project} onClick={() => navigate(project)}>
        <p>{handleString(project)}</p>
        <div></div>
      </button>
      );
    }));
  }, []);

  useEffect(() => {
    // Set submenu max height based on the amount of files found in the directory
    const root = document.querySelector(':root') as HTMLElement;
    const height = buttonRef.current?.offsetHeight ? buttonRef.current?.offsetHeight : 0;
    height !== 0 && root.style.setProperty('--height', `${height * Object.values(props.data)[0].length}px`);
  }, [submenu]);

  function navigate(project: string) {
    // console.log('locatioin', location, `/${Object.keys(props.data)[0].slice(2)}/${project.slice(2)}`);
    props.setActiveHTML(`${props.baseRoute}/${Object.keys(props.data)[0]}/${project}`);
    navigateURL(`${props.baseRoute.slice(2)}/${Object.keys(props.data)[0].slice(2)}/${project.slice(2)}`);
  }

  return (
    <CSSTransition
    nodeRef={submenuRef}
    in={state[props.index]}
    timeout={0}
    classNames="Submenu"
    >
      <div className='Submenu' ref={submenuRef}>
        {submenu}
      </div>
    </CSSTransition>
  )
}

export default Submenu;
