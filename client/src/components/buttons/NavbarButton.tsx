import './NavbarButton.scss';
import { PositionContext } from '../../contexts/PositionContext';
import { useContext, useEffect, useState } from 'react';
import CustomCaret from '../icons/CustomCaret';
import SlideParagraph from '../text/SlideParagraph';
import { AnimationContext } from '../../contexts/AnimationContext';
import { DataContext } from '../../contexts/DataContext';
import LanguageContext from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';


interface NavbarButtonProps {
  index: number;
  function: (attr?: string) => void;
  // initialized: boolean;
  // active: boolean;
}

function NavbarButton(props: NavbarButtonProps) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [previousText, setPreviousText] = useState<string>("");
  const [upcomingText, setUpcomingText] = useState<string>("");

  const { vertical } = useContext(PositionContext);
  const { activeCategory, setActiveCategory, navbarInit } = useContext(AnimationContext);
  const { data } = useContext(DataContext);
  const { language, previousLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  function onPress() {
    props.function();
    setActiveCategory(props.index);
  }

  useEffect(() => {
    setUpcomingText(Object.keys(data[language])[props.index]);
  }, []);

  useEffect(() => {
    if (props.index === activeCategory) {
      setActive(true);
      setPreviousText(Object.keys(data[language])[props.index]);
      setUpcomingText(t('toFrontPage'));
    }
    else if (upcomingText === t('toFrontPage')) {
      setActive(false);
      setUpcomingText(Object.keys(data[language])[props.index]);
      setPreviousText(t('toFrontPage'));
    }
  }, [activeCategory]);

  useEffect(() => {
    console.log('NAVBAR', navbarInit)
    if (navbarInit === props.index) {
      if (active) {
        setPreviousText(t('toFrontPage', {lng: previousLanguage}));
        setUpcomingText(t('toFrontPage'));
      }
      else {
        console.log('AWDAWD')
        setPreviousText(Object.keys(data[previousLanguage])[props.index]);
        setUpcomingText(Object.keys(data[language])[props.index]);
      }
    }
  }, [navbarInit]);

  // useEffect(() => {
  //   if (navbarInit >= 0 && Object.keys(data).length > 0) {
  //     navbarInit >= props.index && setInitialized(true);
  //   }
  // }, [navbarInit]);

  return (
    <button
      className={`
        Nappi
        ${vertical ? 'Down' : 'Up'}
        ${initialized ? 'Initialized' : 'Uninitialized'} 
        ${active && 'Active'}
      `}
      key={`nappi${props.index}`}
      onClick={onPress}
    >
      <div key={`nappiBG${props.index}`} />
      <CustomCaret />
      <p>
        <SlideParagraph 
          // triggerAnim={trigger}
          previousText={previousText}
          upcomingText={upcomingText}
        />
      </p>
    </button>
  )
}

export default NavbarButton;
