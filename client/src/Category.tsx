// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState, useRef, createRef } from 'react';


interface CategoryObj {
  [key: string]: Array<string>
}
interface Props {
  element: CategoryObj,
  index: number,
  handleString: Function
}

function Category({element, index, handleString}: Props) {
  const [projects, setProjects] = useState(Array<JSX.Element>);

  useEffect(() => {
    const tempProjects = [
      'Ohjelmointi',
      '3D-mallinnus',
      'Sekalaiset'
    ];

    const tempArr: Array<JSX.Element> = [];
    tempProjects.forEach(project => {
      tempArr.push(
        <button key={`menu_${project}`}>
          <p>{project}</p>
          <div></div>
        </button>
      )
    });
    setProjects(tempArr);
  }, []);

  return (
    <Element name={`category${index}`} className='CategoryContainer'>
      <div className='Category'>
        <div className='Menu'>
          <h3>Kategoriat</h3>
          {projects}
        </div>
        <h2>{handleString(element)}</h2>
        <div className='TextContainer'>
          <div id='TextBG'></div>
        </div>
      </div>
    </Element>
  )
}

export default Category;
