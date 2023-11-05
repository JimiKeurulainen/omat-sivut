// import './App.css';
import './App.scss';
import { useEffect, useState, useRef, createRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link, animateScroll as scroll } from "react-scroll";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Category from './Category';


function App() {
  const navigateURL = useNavigate();

  const [buttons, setButtons] = useState([]);
  const [lowers, setLowers] = useState([]);
  const categoryRefs = useRef([]);

  const [activeElement, setActiveElement] = useState(0);
  const [pos, setPos] = useState(false);
  const previousElement = useRef(null);
  const nodeRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:5000/content').then(res => {
      const tempBtns = [];
      const tempLowers = [];
      
      res.data.data.forEach((element, index) => {
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
            <p>{element}</p>
            <div ref={el => categoryRefs.current[index] = el} key={`nappiBG${index}`}></div>
          </Link>
        );
        tempLowers.push(
          <Category index={index} element={element} key={`category${index}`}></Category>
        );
      });
      setButtons(tempBtns);
      setLowers(tempLowers);
      console.log('refs', categoryRefs);

    });

    // const href = window.location.href.split('/')[3];
    // if (href !== '') {
    //   setPos(true);
    // }
  }, []);

  useEffect(() => {
    console.log(categoryRefs.current[activeElement]);

    if (activeElement !== previousElement.current && pos) {
      categoryRefs.current[activeElement].classList.add('Active');
      previousElement.current !== '' && categoryRefs.current[previousElement.current].classList.remove('Active');
    }
    if (typeof activeElement === 'string' && activeElement === '') {
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
      setActiveElement('');
    }
    if (pos) {
      scroll.scrollToBottom({
        duration: 1400,
        smooth: 'easeInOutQuad',
      });
    }
  }, [pos]);

  function navigate(index, element) {
    navigateURL('/' + element.replace(' ', '_'));
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
