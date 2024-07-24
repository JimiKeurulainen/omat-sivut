import './Navbar.scss';
import { useEffect, useRef, useContext, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';

import { DataContext } from '../../contexts/DataContext';
import LanguageContext from '../../contexts/LanguageContext';
import { PositionContext } from '../../contexts/PositionContext';
import { AnimationContext } from '../../contexts/AnimationContext';
import CustomButton from '../buttons/NavbarButton';

function Navbar() {
  const [initialize, setInitialize] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<number>(-1);

  const navigateURL = useNavigate();
  const { data } = useContext(DataContext);
  const { language } = useContext(LanguageContext);
  const { vertical } = useContext(PositionContext);
  const { navbarInit, activeCategory } = useContext(AnimationContext);
  const navbarRef = useRef(null);

  useEffect(() => {
    if (navbarInit >= 0 && Object.keys(data).length > 0) {
      setInitialize(true);
    }
  }, [navbarInit]);

  useEffect(() => {
    setActiveButton(activeCategory);
  }, [activeCategory]);

  function handleNavigation(category: string) {
    if (activeButton === Object.keys(data[language]).indexOf(category)) {
      navigateURL(language);
      setActiveButton(-1);
    }
    else {
      navigateURL(language + '/' + category);
      setActiveButton(Object.keys(data[language]).indexOf(category));
    }
  }

  return (
    <CSSTransition
    nodeRef={navbarRef}
    in={vertical}
    timeout={0}
    classNames="Navbar"
    >
      <div className='Navbar' ref={navbarRef}>
        {initialize && Object.keys(data[language]).map((category: string, index: number) => {
          return (
            <CustomButton
              key={'category' + category}
              title={category}
              function={() => handleNavigation(category)}
              initialized={navbarInit >= index}
              active={activeButton === Object.keys(data[language]).indexOf(category)}
            />
          )
        })}
      </div>
    </CSSTransition>
  );
}

export default Navbar;
