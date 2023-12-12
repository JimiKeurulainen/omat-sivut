import './Model.scss';
import { Suspense, useEffect, useRef, useState } from 'react'
import { CameraControls, Gltf, Html, PerspectiveCamera, useGLTF, useProgress } from '@react-three/drei';
import { WireframeMaterial } from '@react-three/drei/materials/WireframeMaterial';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { CSSTransition } from 'react-transition-group';
import { Canvas, extend } from '@react-three/fiber';
import { BackSide } from 'three';
import { handleString, useLanguageContext } from './Root';
extend({Canvas});

interface ModelInfo {
  "1_nimi": string,
  "2_tekijä": string,
  "3_tahkojen_määrä": number,
  "4_kuvaus": string,
}

interface ModelInfoEN {
  "1_name": string,
  "2_author": string,
  "3_polygon_count": number,
  "4_description": string,
}


function Model(props: any) {
  const modelURL = process.env.REACT_APP_MODELS ? process.env.REACT_APP_MODELS : 'no env variable';
  const modelInfoURL = process.env.REACT_APP_MODELSINFO ? process.env.REACT_APP_MODELSINFO : 'no env variable';
  
  const meshRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);
  const detailsRef = useRef<any>(null);
  const loadingRef = useRef<any>(null);
  const {language} = useLanguageContext();
  
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  const [showDetails, setShowDetails] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modelData, setModelData] = useState('');
  const [modelInfo, setModelInfo] = useState<ModelInfo | ModelInfoEN>({
    "1_nimi": '',
    "2_tekijä": '',
    "3_tahkojen_määrä": 0,
    "4_kuvaus": '',
  });
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
      
      }).then(res => {
        // Separate request to get model data as a JSON
        // Used to calculate model polygon count
        axios.get(modelInfoURL + props.ID).then(info => {
          setModelInfo(info.data);
        })
        // When stream ends, create object url to put into Gltf object's source
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

  useEffect(() => {
    let pointCount: number = 0;

    // Loop through mesh children to calculate total polygon count
    const loop = (children: any) => {
      if (children.length > 0) {
        children.forEach((child: any) => {
          if (Object.keys(child).includes('children')) {
            if (child.children.length > 0) {
              loop(child.children);
            }
            else {
              pointCount += child.geometry.index.count;
            }
          }
        });
      }
    }
    meshRef.current && loop(meshRef.current.children);

    // Split amount of points by 3 to get amount of triangles
    setModelInfo({...modelInfo, "3_tahkojen_määrä": pointCount / 3});
  }, [loaded]);

  // Model info's localisation
  useEffect(() => {
    if (language === 'EN') {
      const tempObj: any = {
        "1_name": '',
        "2_author": '',
        "3_polygon_count": 0,
        "4_description": '',
      };
      Object.values(modelInfo).forEach((value, index) => {
        const key: string = Object.keys(tempObj)[index];
        tempObj[key] = value;
      });
      setModelInfo(tempObj);
    }
    else {
      const tempObj: any = {
        "1_nimi": '',
        "2_tekijä": '',
        "3_tahkojen_määrä": 0,
        "4_kuvaus": '',
      };
      Object.values(modelInfo).forEach((value, index) => {
        const key: string = Object.keys(tempObj)[index];
        tempObj[key] = value;
      })
      setModelInfo(tempObj);
    }
  }, [language]);

  function Initializer() {
    const { progress } = useProgress();
    // when Gltf-component finishes loading, set Canvas CSSTransition parameter to true
    progress === 100 && setTimeout(() => setLoaded(true), 500);
    return (
      <Html className='Loading' ref={loadingRef}>
        <FontAwesomeIcon icon={faSpinner} className='Spinner' />
        <h2>{progress} %</h2>
        <p>{language === 'FI' ? 'Alustetaan' : 'Initializing'} "{props.ID}"</p>
      </Html>
    )
  }

  return (
    <div className='UpperContainer'>
      <CSSTransition
      nodeRef={detailsRef}
      in={showDetails}
      timeout={0}
      classNames='ModelDetails'
      >
        <div className='ModelDetails' ref={detailsRef}>
          <FontAwesomeIcon icon={faInfoCircle} onClick={() => setShowDetails(showDetails => !showDetails)} />
          <article>
            <h3>{language === 'FI' ? 'Mallin tiedot:' : 'Model Information:'}</h3>
            {Object.keys(modelInfo).map((key: string, index: number) => {
              return <p key={`infoBit${index}`}><span>{handleString(key)}:</span><span>{Object.values(modelInfo)[index]}</span></p>
            })}
          </article>
        </div>
      </CSSTransition>
      {modelData !== '' ?
      <CSSTransition
        nodeRef={canvasRef}
        in={loaded}
        timeout={0}
        classNames='Canvas'
      >
        <div ref={canvasRef} className='Canvas'>
          <Canvas shadows frameloop='demand'>
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
              ref={meshRef}
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
          <p>{language === 'FI' ? 'Ladataan mallia' : 'Loading model'} "{props.ID}"</p>
        </div>
      </CSSTransition>
      }
    </div>
  );
}

export default Model;
