// import './App.css';
import './App.scss';
import { useEffect, useState, useRef, Ref } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link, animateScroll as scroll } from "react-scroll";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Category from './Category';

interface CategoryObj {
  [key: string]: Array<string>
}

function App() {
  const navigateURL = useNavigate();

  const [buttons, setButtons] = useState(Array<JSX.Element>);
  const [lowers, setLowers] = useState(Array<JSX.Element>);
  const [activeElement, setActiveElement] = useState(0);
  const [pos, setPos] = useState(false);
  
  const categoryRefs = useRef<Array<HTMLDivElement>>(new Array<HTMLDivElement>);
  const previousElement = useRef<number>(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/content').then(res => {
      console.log('refs', res);

      const tempBtns: Array<JSX.Element> = [];
      const tempLowers: Array<JSX.Element> = [];
      
      res.data.data.forEach((element: CategoryObj, index: number) => {
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
            <p>{handleString(element)}</p>
            <div ref={(el: HTMLDivElement) => categoryRefs.current[index] = el} key={`nappiBG${index}`}></div>
          </Link>
        );
        tempLowers.push(
          <Category index={index} element={element} handleString={handleString} key={`category${index}`}></Category>
        );
      });
      setButtons(tempBtns);
      setLowers(tempLowers);
    });

    // const href = window.location.href.split('/')[3];
    // if (href !== '') {
    //   setPos(true);
    // }
  }, []);

  useEffect(() => {
    if (activeElement !== previousElement.current && pos) {
      categoryRefs.current[activeElement].classList.add('Active');
      previousElement.current !== 0 && categoryRefs.current[previousElement.current].classList.remove('Active');
    }
    if (activeElement === 0 && categoryRefs.current[previousElement.current]) {
      categoryRefs.current[previousElement.current].classList.remove('Active');
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
    // navigateURL('/' + Object.keys(element)[0]);
    setActiveElement(index);
    previousElement.current === index ? setPos(false) : setPos(true);
  }

  function handleString(string: any) {    
    if (typeof string !== 'string') {
      const obj = Object.keys(string)[0].slice(2);
      const str = obj.charAt(0).toUpperCase() + obj.slice(1);
      return str.replace(/_/g, ' ');
    }
    else {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  return (
      <div id='App'>
        <div id='Upper'>
          <header>Jimi Keurulainen</header>
        </div>

        <CSSTransition
        nodeRef={nodeRef}
        in={pos}
        timeout={1000}
        classNames="Navbar">
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
