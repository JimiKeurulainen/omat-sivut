import './App.scss';
import { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Element, scroller, animateScroll as scroll, Events } from "react-scroll";
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { useDataContext, handleString, useLanguageContext } from './Root';

import Category from './Category';
import Model from './Model';
import Header from './Header';


interface CategoryObj {
  [key: string]: Array<SubCategoryObj>
}
interface SubCategoryObj {
  [key: string]: Array<string>
}

function App() {
  const navigateURL = useNavigate();
  const data = useDataContext();
  const location = useLocation();
  const isMobile = useMediaQuery({query: '(max-width: 600px)'});
  const {language, previousPath} = useLanguageContext();

  const [categories, setCategories] = useState(Array<string>);
  const [buttons, setButtons] = useState(Array<JSX.Element>);
  const [lowers, setLowers] = useState(Array<JSX.Element>);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState(false);
  
  const categoryRefs = useRef<Array<HTMLButtonElement>>(new Array<HTMLButtonElement>);
  const previousElement = useRef<number>(0);
  const nodeRef = useRef(null);
  const appRef = useRef<any>(null);

  // Generate components based on data
  useEffect(() => {
    // navigateURL('/FI');
    // Add temporary categories that will be used to set states
    const tempBtns: Array<JSX.Element> = [];
    const tempLowers: Array<JSX.Element> = [];
    
    // Loop through the response and add items to temporary arrays accordingly
    setCategories(data.map((category) => {
      return Object.keys(category)[0].slice(2)
    }));

    data.forEach((element: CategoryObj, index: number) => {
      index += 1;
      tempBtns.push(
        <button
          className='Nappi'
          key={`nappi${index}`}
          onClick={() => navigate(index, element)}
          ref={(el: HTMLButtonElement) => categoryRefs.current[index] = el}
        >
          <div key={`nappiBG${index}`}></div>
          <FontAwesomeIcon icon={faCaretUp} className='CaretIcon'/>
          <p className='Etusivulle'>{language === 'FI' ? 'Etusivulle' : 'To home page'}</p>
          <p>{handleString(Object.keys(element)[0])}</p>
        </button>
      );
      tempLowers.push(
        <Category index={index} element={element} key={`category${index}`}></Category>
      );
    });
    setButtons(tempBtns);
    setLowers(tempLowers);
    setLoading(true);

    // Navbar offset in mobile view
    if (isMobile) {
      const elemRect = document.getElementById('Lower')?.getBoundingClientRect();
      document.documentElement.style.setProperty('--offset', `${elemRect?.top}px`);
    }
  }, [data]);

  // Navigate based on location
  useEffect(() => {
    // If location corresponds front-page
    if (location.pathname.split('/').length === 2) {
      setPos(false);
      scroll.scrollToTop({
        duration: 1000,
        smooth: 'easeInOutQuad',
      });
      previousElement.current !== 0 && categoryRefs.current[previousElement.current].classList.remove('Active');
    }
    // If location is other than front-page
    else {
      setPos(true);
      // Get active element based on location
      const active = categories.indexOf(location.pathname.split('/')[2]) + 1;

      // Activate scrolling function
      lowers[active - 1] && scrollToElem(`category${active}`);
      // Modify navigation buttons' classes
      if (active !== previousElement.current) {
        categoryRefs.current[active].classList.add('Active');
        // If viewed with mobile device, make 'to front page' (etusivulle) text visible without on hover
        isMobile && document.documentElement.style.setProperty('--mobileOpacity', '1');
        previousElement.current !== 0 && categoryRefs.current[previousElement.current].classList.remove('Active');
      }
      if (active === 0 && categoryRefs.current[previousElement.current]) {
        isMobile && document.documentElement.style.setProperty('--mobileOpacity', '0');
        categoryRefs.current[previousElement.current].classList.remove('Active');
      }
      // In the end, update the previous element to be the active element
      previousElement.current = active;

      // Add event listener that will scroll to right position,
      //  if screen size is changed and user is scrolled to lower
      window.addEventListener('resize', (event) => {
        scroller.scrollTo(`category${active}`, {
          duration: 500,
          delay: 0,
          smooth: true,
          containerId: 'Lower',
          horizontal: true
        });
        let appHeight = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--appHeight', `${appHeight}px`);
      });
    }
  }, [location]);

  useEffect(() => {
    // Reconstruct file path to navigate to the other language's equivalent path
    var tempPath: string = '/' + language;

    if (location.pathname.split('/').length !== 2) {
      data.forEach(category => {
        if (Object.keys(category)[0].split('_')[0] === previousPath[0]) {
          tempPath += '/' + Object.keys(category)[0].slice(2);
          console.log('langsel', language, data, previousPath, tempPath);

          if (previousPath.length > 1) {
            Object.values(category)[0].forEach(subcategory => {
              if (Object.keys(subcategory)[0].split('_')[0] === previousPath[1]) {
                tempPath += '/' + Object.keys(subcategory)[0].slice(2);
                Object.values(subcategory)[0].forEach(file => {
                  file.split('_')[0] === previousPath[2] && (tempPath += '/' + file.slice(2));
                });
              }
            });
          }
        }
      });
    }
    console.log(location.pathname.split('/'))
    navigateURL(tempPath);
  }, [data]);

  function scrollToElem(target: string) {
    let goToContainer = new Promise<void>((resolve, reject) => {
      Events.scrollEvent.register('end', () => {
        resolve();
        Events.scrollEvent.remove('end');
      });
      scroller.scrollTo('Lower', {
        duration: 1000,
        delay: 0,
        smooth: true
      });
    });
    goToContainer.then(() =>
      scroller.scrollTo(target, {
        duration: 500,
        delay: 0,
        smooth: true,
        containerId: 'Lower',
        horizontal: true
      })
    );
  }
 
  function navigate(index: number, element: CategoryObj) {
    // If the active element is the same as the previous element,
    // Navigate to the front page
    if (previousElement.current === index) {
      categoryRefs.current[previousElement.current].classList.remove('Active');
      previousElement.current = 0;
      navigateURL('/' + language);
    }
    else {
      navigateURL('/' + language + '/' + Object.keys(element)[0].slice(2));
    }
  }

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

        <CSSTransition
          nodeRef={nodeRef}
          in={pos}
          timeout={0}
          classNames="Navbar"
        >
          <div ref={nodeRef} className='Navbar'>
            {buttons}
            <div id='NavbarBG'></div>
          </div>
        </CSSTransition>

        <Element name='Lower' id='Lower'>
          <div id='LowerContainer' style={{width: `${lowers.length * 100}vw`}}>
            {lowers}
          </div>
        </Element>
      </div>
    </CSSTransition>
  );
}

export default App;
