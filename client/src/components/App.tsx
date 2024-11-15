import './App.scss';
import { useEffect, useState, useRef, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Element, scroller, animateScroll as scroll, Events } from "react-scroll";
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';

import Category from './Category';
import Model from './Model';
import Header from './Header';
import LanguageContext from '../contexts/LanguageContext';
import { DataContext } from '../contexts/DataContext';
import Navbar from './layout/Navbar';
import i18n from '../translations/i18n';
import { RouteObj } from '../types/types';
import { AnimationContext } from '../contexts/AnimationContext';
import { PositionContext } from '../contexts/PositionContext';


interface CategoryObj {
  [key: string]: Array<SubCategoryObj>
}
interface SubCategoryObj {
  [key: string]: Array<string>
}

function App() {
  const [categories, setCategories] = useState<Array<RouteObj>>([]);
  const [loading, setLoading] = useState(false);

  const { data } = useContext(DataContext);
  const { language } = useContext(LanguageContext);
  const { setAppRef, activeCategory, setActiveCategory } = useContext(AnimationContext);
  const { vertical } = useContext(PositionContext);

  const navigateURL = useNavigate();
  const isMobile = useMediaQuery({query: '(max-width: 600px)'});
  const appRef = useRef<any>(null);

  // useEffect(() => {
  //   window.addEventListener('wheel', (e) => {
  //     console.log('AAAa', e.deltaY, vertical, activeCategory);

  //     if (!vertical && e.deltaY > 0) {
  //       const index: number = activeCategory > 0 ? activeCategory : 0;

  //       navigateURL(language + '/' + Object.keys(data[language])[index]);
  //       // setActiveCategory(index);
  //     }
  //     else if (e.deltaY < 0) {
  //       navigateURL(language);
  //       // setActiveCategory(-1);
  //     }
  //   })
  // }, []);

  useEffect(() => {
    if (Object.keys(data).length > 0 && language) {
      setLoading(true);
      setCategories(Object.values(data[language]));
      setAppRef(appRef.current);
    }
  }, [data]);

  return (
    <CSSTransition
    nodeRef={appRef}
    in={loading}
    timeout={0}
    classNames="App"
    >
      <div className='App' ref={appRef}>  
        <div id='Upper'> 
          <Header />
          <Model position={[0, 0, 2]} ID='sportscar' />
        </div>

        <Navbar />

        <Element name='Lower' id='Lower' key='appKey'>
          <div id='LowerContainer' style={{width: `${categories.length * 100}vw`}}>
            {categories.map((element: any, index: number) => {
              return <Category index={index} element={element} key={`category${index}`}></Category>
            })}
          </div>
        </Element>
      </div>
    </CSSTransition>
  );
}

export default App;
