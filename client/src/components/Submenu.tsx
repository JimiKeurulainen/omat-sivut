// import './App.css';
import './Submenu.scss';
import { useEffect, useState, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import LanguageContext from '../contexts/LanguageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { DataContext } from '../contexts/DataContext';

interface Props {
  baseRoute: string,
  title: string,
  data: Array<string>,
  index: number,
  setMenu: Function,
  setActiveHtml: Function,
}

function Submenu(props: Props) {
  const navigateURL = useNavigate();
  const isMobile = useMediaQuery({query: '(max-width: 600px)'});
  const { language } = useContext(LanguageContext);
  const { routes } = useContext(DataContext);
  const location = useLocation();

  const [submenuHeight, setSubmenuHeight] = useState<number>(0);
  const [buttonHeight, setButtonHeight] = useState<number>(0);
  const [active, setActive] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    buttonRef.current?.clientHeight && setButtonHeight(buttonRef.current?.clientHeight + 2);

    let height = 0;
    for (let i = 0; i <= props.data.length; i++) {
      buttonRef.current?.clientHeight && (height += buttonRef.current?.clientHeight);
    }
    setSubmenuHeight(height);
  }, [props.data]);

  function navigate(project: string) {
    console.log('DATA', `${language}/${props.baseRoute}/${project}`, props.data);
    props.setActiveHtml(project);
    console.log('ROUTES', routes)

    // navigateURL(`${language}/${props.baseRoute}/${project}`);
    isMobile && props.setMenu(false);
  }

  return (
    <div 
      className={`
        Submenu
        ${active && 'Active'}
      `}
      style={{maxHeight: active ? submenuHeight : buttonHeight}}
      key={'submenu' + props.title}
    >
      <button 
        onClick={() => setActive(!active)}
        ref={buttonRef}
      >
        {props.data.length > 0 ? <FontAwesomeIcon icon={faCaretRight} /> : <span />}
        <p>{props.title}</p>
        <div />
      </button>
      {props.data.map((project: string)=> {
        return (
          <button 
            className='SubmenuBtn'
            key={'projectBtn' + project} 
            onClick={() => navigate(project)}
          >
            <p className='TextInit'>{project.replaceAll("_", " ")}</p>
          </button>
        )
      })}
    </div>
  )
}

export default Submenu;
