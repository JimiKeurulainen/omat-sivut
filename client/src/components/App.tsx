import './App.scss';
import { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Element, scroller, animateScroll as scroll, Events } from "react-scroll";
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import Category from './Category';
import { useDataContext, handleString } from './Root';
import Model from './Model';
import { Canvas } from '@react-three/fiber';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import { BackSide } from 'three';


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

  const [categories, setCategories] = useState(Array<string>);
  const [buttons, setButtons] = useState(Array<JSX.Element>);
  const [lowers, setLowers] = useState(Array<JSX.Element>);
  const [loading, setLoading] = useState(false);
  const [pos, setPos] = useState(false);
  
  const categoryRefs = useRef<Array<HTMLDivElement>>(new Array<HTMLDivElement>);
  const previousElement = useRef<number>(0);
  const nodeRef = useRef(null);
  const appRef = useRef<any>(null);

  // Generate components based on data
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
          <button
            className='Nappi'
            key={`nappi${index}`}
            onClick={() => navigate(index, element)}
          >
            <div ref={(el: HTMLDivElement) => categoryRefs.current[index] = el} key={`nappiBG${index}`}></div>
            <FontAwesomeIcon icon={faCaretUp} className='CaretIcon'/>
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
  }, [data]);

  // Navigate based on location
  useEffect(() => {
    // If location corresponds front-page
    if (location.pathname === '/') {
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
      const active = categories.indexOf(location.pathname.split('/')[1]) + 1;
      // Activate scrolling function
      lowers[active - 1] && scrollToElem(`category${active}`);
      // Modify navigation buttons' classes
      if (active !== previousElement.current) {
        categoryRefs.current[active].classList.add('Active');
        previousElement.current !== 0 && categoryRefs.current[previousElement.current].classList.remove('Active');
      }
      if (active === 0 && categoryRefs.current[previousElement.current]) {
        categoryRefs.current[previousElement.current].classList.remove('Active');
      }
      // In the end, update the previous element to be the active element
      previousElement.current = active;
    }
  }, [location, lowers]);

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
      navigateURL('/');
    }
    else {
      navigateURL('/' + Object.keys(element)[0].slice(2));
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
