import './Model.scss';
import { Suspense, useEffect, useRef, useState } from 'react'
import { CameraControls, Gltf, Html, PerspectiveCamera, useGLTF, useProgress } from '@react-three/drei';
import { WireframeMaterial } from '@react-three/drei/materials/WireframeMaterial';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import { Canvas, extend } from '@react-three/fiber';
import { BackSide } from 'three';
extend({Canvas});


function Model(props: any) {
  const modelURL = process.env.REACT_APP_MODELS ? process.env.REACT_APP_MODELS : 'no env variable';
  
  const ref = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const loadingRef = useRef<any>(null);
  
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  const [progress, setProgress] = useState(0);
  const [modelData, setModelData] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cancelTokenSource = axios.CancelToken.source();

    // Get model data stream, if model is not already loaded
    if (!modelData && !cancelTokenSource.token.reason) {
      axios.get(modelURL + props.ID, {responseType: 'arraybuffer', onDownloadProgress: (progEvent) => {
        // Calculate progress percentage
        if (!cancelTokenSource.token.reason) {
          const total = progEvent.total !== undefined ? progEvent.total : 1;
          setProgress(Math.floor((progEvent.loaded / total) * 100));
        }
      // If component gets unmounted, cancel stream request
      }, cancelToken: cancelTokenSource.token,
      
      // When stream ends, create object url to put into Gltf object's source
      }).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data], {type: 'model/gltf-binary'}));
        setModelData(url);
      // Log and error if model get request is cancelled
      }).catch(error => {
        console.log(error.message);
      });
    };
    return () => {
      if (!cancelTokenSource.token.reason) {
        cancelTokenSource.cancel('Request canceled: New request intiated');
      }
    };
  }, []);

  function Initializer() {
    const { progress } = useProgress();
    // when Gltf-component finishes loading, set Canvas CSSTransition parameter to true
    progress === 100 && setTimeout(() => setLoaded(true), 500);
    return (
      <Html className='Loading' ref={loadingRef}>
        <FontAwesomeIcon icon={faSpinner} className='Spinner' />
        <h2>{progress} %</h2>
        <p>Initializing "{props.ID}"</p>
      </Html>
    )
  }

  return (
    <div className='UpperContainer'>
      {modelData !== '' ?
      <CSSTransition
        nodeRef={canvasRef}
        in={loaded}
        timeout={0}
        classNames='Canvas'
      >
        <div ref={canvasRef} className='Canvas'>
          <Canvas shadows>
            <Suspense fallback={<Initializer />}>
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
              <mesh
              {...props}
              ref={ref}
              receiveShadow
              >
                {modelData !== '' && <Gltf src={modelData} castShadow></Gltf>}
              </mesh>
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
            </Suspense>
          </Canvas> 
        </div>
      </CSSTransition>
      :
      <CSSTransition
        nodeRef={loadingRef}
        in={modelData === ''}
        timeout={0}
        classNames='Loading'
      >
        <div className='Loading' ref={loadingRef}>
          <FontAwesomeIcon icon={faSpinner} className='Spinner' />
          <h2>{progress} %</h2>
          <p>Loading model "{props.ID}"</p>
        </div>
      </CSSTransition>
      }
    </div>
  );
}

export default Model;
