// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState, useRef, createRef } from 'react';


function Category(props) {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const tempProjects = [
      'Ohjelmointi',
      '3D-mallinnus',
      'Sekalaiset'
    ];

    const tempArr = [];
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
    <Element name={`category${props.index}`} className='CategoryContainer'>
      <div className='Category'>
        <div className='Menu'>
          <h3>Kategoriat</h3>
          {projects}
        </div>
        <h2>{props.element}</h2>
        <div className='TextContainer'>
          <div id='TextBG'></div>
        </div>
      </div>
    </Element>
  )
}

export default Category;
