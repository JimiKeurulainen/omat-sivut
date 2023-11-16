import './HTMLContent.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';


interface Props {
  ID: string
}

function HTMLContent(props: Props) {
  const filesURL = process.env.REACT_APP_FILES ? process.env.REACT_APP_FILES : 'no env variable';

  const [documentData, setDocumentData] = useState('');
  const [documentImages, setDocumentImages] = useState(Array<string>);

  useEffect(() => {
    axios.get(filesURL + props.ID).then((res: any) => {
      if (res.data.images && res.data.images.length > 0) {
        setDocumentImages(res.data.images);
      }
      setDocumentData(res.data.data);
    });
  }, []);

  useEffect(() => {
    const images = document.querySelectorAll('.HTMLContent img');
    documentImages.length > 0 && images[0].setAttribute('src', 'data:image/png;base64,' + documentImages[0]);
  }, [documentData, documentImages]);

  return (
      <div className='HTMLContent' dangerouslySetInnerHTML={{__html: documentData}}></div>
  )
}

export default HTMLContent;
