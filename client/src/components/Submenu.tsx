// import './App.css';
import './Submenu.scss';
import { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import axios from 'axios';


interface Props {
  category: string,
  subcategory: string,
}

function Submenu({category, subcategory}: Props) {
  const [submenu, setSubmenu] = useState(Array<JSX.Element>);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get(`http://jimikeurulainen.site/content/${category}/${subcategory}`).then(res => {
      setSubmenu(res.data.data.map((project: string) => {
        return <button ref={buttonRef}>{project}</button>
      }));
      // Set submenu max height based on the amount of files found in the directory
      const root = document.querySelector(':root') as HTMLElement;
      const height = buttonRef.current?.offsetHeight;
      root.style.setProperty('--height', `${height && height * res.data.data.length}px`);
    });
  }, []);

  return (
    <CSSTransition
    nodeRef={submenuRef}
    in={submenu.length > 0}
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
