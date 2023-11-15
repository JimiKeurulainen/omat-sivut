import './App.scss';
import { useEffect, useState, useRef, Ref, useContext, createContext } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Link, scroller, animateScroll as scroll } from "react-scroll";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import Category from './Category';
import { useDataContext, handleString } from './Root';
import Model from './Model';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Environment, PerspectiveCamera } from '@react-three/drei';
import THREE, { BackSide, ShadowMaterial } from 'three';


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
  const [loading, setLoading] = useState(false);
  const [activeElement, setActiveElement] = useState(0);
  const [pos, setPos] = useState(false);
  
  const categoryRefs = useRef<Array<HTMLDivElement>>(new Array<HTMLDivElement>);
  const previousElement = useRef<number>(0);
  const nodeRef = useRef(null);
  const appRef = useRef<any>(null);

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
      setLoading(true);

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

  useEffect(() => {
    console.log('loading', loading, appRef.current.classList);
  }, [loading])

  function navigate(index: number, element: CategoryObj) {
    navigateURL('/' + Object.keys(element)[0].slice(2));
    setActiveElement(index);
    previousElement.current === index ? setPos(false) : setPos(true);
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
          <header>Jimi Keurulainen</header>
          <Canvas shadows>
            <fog attach="fog" args={['black', 0, 40]} />
            <CameraControls minPolarAngle={0} maxPolarAngle={Math.PI / 1.6} />
            <ambientLight />
            <directionalLight 
              position={[10, 5, 0]} 
              color='rgb(49, 123, 173)' 
              intensity={20} 
              castShadow
            >
              <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
            </directionalLight>
            <directionalLight position={[-10, 5, 10]} color='white' intensity={0.5} castShadow/>
            <directionalLight position={[-5, 1, -7]} color='rgb(200, 200, 240)' intensity={10} castShadow/>

            <Model position={[0, 0, 2]} />

            <mesh rotation={[Math.PI / -2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
              <planeGeometry args={[300, 300]} />
              <shadowMaterial transparent opacity={0.4} />
              <meshStandardMaterial color={'grey'} roughness={0.2} metalness={0.9}/>
            </mesh>

            <mesh rotation={[Math.PI / -2, 0, 0]}>
              <sphereGeometry args={[150, 32, 16]} />
              <meshStandardMaterial color={'black'} roughness={1} metalness={0} side={BackSide}/>
            </mesh>

            <PerspectiveCamera makeDefault position={[3, 0.5, 4]} />
          </Canvas>
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
    </CSSTransition>
  );
}

export default App;
