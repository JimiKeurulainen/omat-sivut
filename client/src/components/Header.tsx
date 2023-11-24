// import './App.css';
import './Header.scss';
import { useEffect, useState, useRef, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';


function Header() {
  const [lang, setLang] = useState('FI');
  const langRef = useRef(null);

  useEffect(() => {
    console.log('lang', lang);
  }, [lang]);

  return (
      <header className='Header'>
        <h1>Jimi Keurulainen</h1>
        <CSSTransition
        nodeRef={langRef}
        in={lang === 'EN'}
        timeout={0}
        classNames="LangSelect"
        >
        <div className='LangSelect' ref={langRef} onClick={() => setLang(lang === 'FI' ? 'EN' : 'FI')}>
          <p>FI</p>
          <span><div /></span>
          <p>EN</p>
        </div>
        </CSSTransition>
      </header>
  )
}

export default Header;
