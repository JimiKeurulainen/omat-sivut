import './Navbar.scss';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataContext } from '../../contexts/DataContext';
import LanguageContext from '../../contexts/LanguageContext';
import { PositionContext } from '../../contexts/PositionContext';
import { AnimationContext } from '../../contexts/AnimationContext';
import NavbarButton from '../buttons/NavbarButton';

function Navbar() {
  const { data } = useContext(DataContext);
  const { vertical } = useContext(PositionContext);

  return (
    <div 
      className={`
        Navbar
        ${vertical && 'Down'}
      `}
    >
      {data.FI && Object.keys(data.FI).map((category: string, index: number) => {
        return (
          <NavbarButton
            key={'category' + category}
            index={index}
          />
        )
      })}
    </div>
  );
}

export default Navbar;
