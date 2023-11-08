// import './App.css';
import './Category.scss';
import { Element } from "react-scroll";
import { useEffect, useState } from 'react';


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
    const tempArr: Array<JSX.Element> = [];
    Object.values(element)[0].forEach(project => {
      tempArr.push(
        <button key={`menu_${project}`}>
          <p>{handleString(project)}</p>
          <div></div>
        </button>
      )
    });
    setProjects(tempArr);
  }, []);

  return (
    <Element name={`category${index}`} className='CategoryContainer'>
      <div className='Category'>
        {projects.length !== 0 &&
        <div className='Menu'>
          <h3>Kategoriat</h3>
          {projects}
        </div>
        }
        <h2>{handleString(element)}</h2>
        <div className='TextContainer'>
          <div id='TextBG'></div>
        </div>
      </div>
    </Element>
  )
}

export default Category;
