// import './App.css';
import './Submenu.scss';
import { useEffect, useState, useRef, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useStateContext } from './Category';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import LanguageContext from '../contexts/LanguageContext';
import { SubRouteObj } from '../types/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

interface Props {
  baseRoute: string,
  title: string,
  data: Array<string>,
  index: number,
  // openMenu: Function,
  setMenu: Function,
  setActiveHTML: Function
}

function Submenu(props: Props) {
  const navigateURL = useNavigate();
  const isMobile = useMediaQuery({query: '(max-width: 600px)'});
  const { language } = useContext(LanguageContext);

  const [submenuHeight, setSubmenuHeight] = useState<number>(0);
  const [buttonHeight, setButtonHeight] = useState<number>(0);
  const [active, setActive] = useState<boolean>(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.clientHeight && setButtonHeight(buttonRef.current?.clientHeight + 2);

    let height = 0;
    for (let i = 0; i <= props.data.length; i++) {
      buttonRef.current?.clientHeight && (height += buttonRef.current?.clientHeight + 2);
    }
    setSubmenuHeight(height);
  }, [props.data]);

  function navigate(project: string) {
    props.setActiveHTML(`${props.baseRoute}/${Object.keys(props.data)[0]}/${project}`);
    navigateURL(`${language}/${props.baseRoute.slice(2)}/${Object.keys(props.data)[0].slice(2)}/${project.slice(2)}`);
    isMobile && props.setMenu(false);
  }

  return (
    <CSSTransition
      nodeRef={submenuRef}
      in={true}
      timeout={0}
      classNames="Submenu"
    >
      <div 
        className='Submenu' 
        ref={submenuRef}
        style={{maxHeight: active ? submenuHeight : buttonHeight}}
        key={'submenu' + props.title}
      >
        <button 
          onClick={() => setActive(!active)}
          ref={buttonRef}
        >
          <FontAwesomeIcon icon={faCaretRight} />
          <p>{props.title}</p>
          <div></div>
        </button>
        {/* {Object.keys(props.data).map((project: any)=> {
          // ref={(el: HTMLDivElement) => submenuRefs.current[props.index] = el}
          return (
            <div className='SubmenuContainer' key={'subcontainer' + props.title}>
              <button ref={buttonRef} key={'projectBtn' + project} onClick={() => navigate('')}>
                <p>{Object.keys(project)[0]}</p>
              </button>         
            </div>
          )
        })} */}
      </div>
    </CSSTransition>
  )
}

export default Submenu;
