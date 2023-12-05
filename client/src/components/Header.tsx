import './Header.scss';
import { useRef } from 'react';
import { useLanguageContext } from './Root';
import LangSelect from './LangSelect';


function Header() {

  return (
      <header className='Header'>
        <h1>Jimi Keurulainen</h1>
        <LangSelect />
      </header>
  )
}

export default Header;
