import './Navbar.scss';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DataContext } from '../../contexts/DataContext';
import LanguageContext from '../../contexts/LanguageContext';
import { PositionContext } from '../../contexts/PositionContext';
import { AnimationContext } from '../../contexts/AnimationContext';
import NavbarButton from '../buttons/NavbarButton';

function Navbar() {
  const [activeButton, setActiveButton] = useState<number>(-1);

  const navigateURL = useNavigate();
  const { data } = useContext(DataContext);
  const { language } = useContext(LanguageContext);
  const { vertical } = useContext(PositionContext);
  // const { activeCategory } = useContext(AnimationContext);

  useEffect(() => {
    console.log(data);
  }, []);

  // function handleNavigation(category: string) {
  //   if (activeButton === Object.keys(data[language]).indexOf(category)) {
  //     navigateURL(language);
  //     setActiveButton(-1);
  //   }
  //   else {
  //     navigateURL(language + '/' + category);
  //     setActiveButton(Object.keys(data[language]).indexOf(category));
  //   }
  // }

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
            // function={() => handleNavigation(category)}
          />
        )
      })}
    </div>
  );
}

export default Navbar;
