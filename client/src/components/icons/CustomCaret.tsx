import './CustomCaret.scss';
import { useTranslation } from 'react-i18next';
import { PositionContext } from '../../contexts/PositionContext';
import { useContext, useEffect } from 'react';


interface CustomCaretProps {
  title: string;
  function: (attr?: string) => void;
  initialized: boolean;
  active: boolean;
}

function CustomCaret() {

  return (
    <svg height="22" width="22" xmlns="http://www.w3.org/2000/svg" className='Caret'>
      <defs>
        <linearGradient id="grad2" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
          <stop offset="45%" stop-color="white" />
          <stop offset="55%" stop-color="white" />
          <stop offset="100%" stop-color="rgba(255, 255, 255, 0.2)" />
        </linearGradient>
        <filter id="f1" width="22" height="22">
          <feOffset in="SourceGraphic" dx="20" dy="20" />
          <feBlend in="SourceGraphic" in2="offOut" />
        </filter>
      </defs>
      <polyline 
        points="1,10 10,1 21,10"
      />
    </svg> 
  )
}

export default CustomCaret;
