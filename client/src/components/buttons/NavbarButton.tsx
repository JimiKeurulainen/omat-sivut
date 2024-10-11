import './NavbarButton.scss';
import { PositionContext } from '../../contexts/PositionContext';
import { useContext, useEffect, useState } from 'react';
import CustomCaret from '../icons/CustomCaret';
import SlideParagraph from '../text/SlideParagraph';
import { AnimationContext } from '../../contexts/AnimationContext';
import { DataContext } from '../../contexts/DataContext';
import LanguageContext from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


interface NavbarButtonProps {
  index: number;
}

function NavbarButton(props: NavbarButtonProps) {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const [previousText, setPreviousText] = useState<string>("");
  const [upcomingText, setUpcomingText] = useState<string>("");

  const navigateURL = useNavigate();
  const { vertical } = useContext(PositionContext);
  const { activeCategory, setActiveCategory, navbarInit } = useContext(AnimationContext);
  const { data } = useContext(DataContext);
  const { language, previousLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();

  function onPress() {
    setActiveCategory(props.index);
    if (props.index === activeCategory && vertical) {
      navigateURL(language);
    }
    else {
      navigateURL(language + '/' + Object.keys(data[language])[props.index]);
    }
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
      setPreviousText(t('toFrontPage'));
      setUpcomingText(Object.keys(data[language])[props.index]);
    }
  }, [activeCategory]);

  useEffect(() => {
    if (props.index === activeCategory && !vertical) {
      setActive(false);
      setUpcomingText(Object.keys(data[language])[props.index]);
      setPreviousText(t('toFrontPage'));
    }
    else if (props.index === activeCategory) {
      setActive(true);
      setUpcomingText(t('toFrontPage'));
      setPreviousText(Object.keys(data[language])[props.index]);
    }
  }, [vertical]);

  useEffect(() => {
    if (navbarInit === props.index) {
      if (active) {
        setPreviousText(t('toFrontPage', {lng: previousLanguage}));
        setUpcomingText(t('toFrontPage'));
      }
      else {
        setPreviousText(Object.keys(data[previousLanguage])[props.index]);
        setUpcomingText(Object.keys(data[language])[props.index]);
      }
    }
  }, [navbarInit]);

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
          key={previousText}
          previousText={previousText}
          upcomingText={upcomingText}
        />
      </p>
    </button>
  )
}

export default NavbarButton;
