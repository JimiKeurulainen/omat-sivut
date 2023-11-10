import './HTMLContent.scss';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';


interface Props {
  ID: string
}

function Category({ID}: Props) {
  const [document, setDocument] = useState('');

  useEffect(() => {
    axios.get(`http://jimikeurulainen.site/content/2_projektini/1_ohjelmointi/`).then((res: any) => {
      setDocument(res.data.data);
    });
  }, []);

  return (
    <div className='HTMLContent' dangerouslySetInnerHTML={{__html: document}}></div>
  )
}

export default Category;