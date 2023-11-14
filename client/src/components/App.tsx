import './App.scss';
import { useEffect, useState, useRef, Ref, useContext, createContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link, scroller, animateScroll as scroll } from "react-scroll";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import Category from './Category';
import { useDataContext, handleString } from './Root';

interface CategoryObj {
  [key: string]: {
    [key: string]: Array<string>
  }
}

function App() {
  const navigateURL = useNavigate();
  const data = useDataContext();

  const [categories, setCategories] = useState(Array<string>);
  const [buttons, setButtons] = useState(Array<JSX.Element>);
  const [lowers, setLowers] = useState(Array<JSX.Element>);
  const [activeElement, setActiveElement] = useState(0);
  const [pos, setPos] = useState(false);
  
  const categoryRefs = useRef<Array<HTMLDivElement>>(new Array<HTMLDivElement>);
  const previousElement = useRef<number>(0);
  const nodeRef = useRef(null);

  useEffect(() => {
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
          <Link
            className='Nappi'
            key={`nappi${index}`}
            to={`category${index}`}
            containerId='Lower'
            isDynamic={true}
            horizontal={true}
            smooth={true}
            duration={500}
            onClick={() => navigate(index, element)}
          >
            <div ref={(el: HTMLDivElement) => categoryRefs.current[index] = el} key={`nappiBG${index}`}></div>
            <FontAwesomeIcon icon={faCaretUp} className='CaretIcon'/>
            <p>{handleString(Object.keys(element)[0])}</p>
          </Link>
        );
        tempLowers.push(
          <Category index={index} element={element} key={`category${index}`}></Category>
        );
      });
      setButtons(tempBtns);
      setLowers(tempLowers);

      // // Navigate to correct position onload based on URL
      // const href = window.location.href.split('/')[3];
      // if (href !== '') {
      //   setPos(true);
      //   setActiveElement(tempCategories.indexOf(href) + 1);
      // }
  }, [data]);

  useEffect(() => {
    if (activeElement !== previousElement.current && pos) {
      categoryRefs.current[activeElement].classList.add('Active');
      previousElement.current !== 0 && categoryRefs.current[previousElement.current].classList.remove('Active');

      scroller.scrollTo(`category${categories.indexOf(window.location.href.split('/')[3]) + 1}`, {
        duration: 500,
        containerId: 'Lower',
        isDynamic: true,
      });
    }
    if (activeElement === 0 && categoryRefs.current[previousElement.current]) {
      categoryRefs.current[previousElement.current].classList.remove('Active');
      navigateURL('/');
    }
    previousElement.current = activeElement;
  }, [activeElement]);

  useEffect(() => {
    if (!pos) {
      scroll.scrollToTop({
        duration: 1000,
        smooth: 'easeInOutQuad',
      });
      setActiveElement(0);
    }
    if (pos) {
      scroll.scrollToBottom({
        duration: 1400,
        smooth: 'easeInOutQuad',
      });
    }
  }, [pos]);

  function navigate(index: number, element: CategoryObj) {
    navigateURL('/' + Object.keys(element)[0].slice(2));
    setActiveElement(index);
    previousElement.current === index ? setPos(false) : setPos(true);
  }

  return (
      <div id='App'>
        <div id='Upper'>
          <header>Jimi Keurulainen</header>
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

        <div id='Lower' className={pos ? 'changeCol' : 'ProjectContainer'}>
          <div id='LowerContainer' style={{width: `${lowers.length * 100}vw`}}>
            {lowers}
          </div>
        </div>
      </div>
  );
}

export default App;
