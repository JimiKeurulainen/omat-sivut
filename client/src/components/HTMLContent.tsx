import './HTMLContent.scss';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';


interface Props {
  ID: string
}

function HTMLContent(props: Props) {
  const [document, setDocument] = useState('');

  useEffect(() => {
    console.log('id', props.ID);
    axios.get(`http://jimikeurulainen.site/content/${props.ID}`).then((res: any) => {
      setDocument(res.data.data);
    });
  }, []);

  return (
    <div className='HTMLContent' dangerouslySetInnerHTML={{__html: document}}></div>
  )
}

export default HTMLContent;
