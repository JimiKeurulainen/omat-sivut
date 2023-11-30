import './HTMLContent.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { sanitize } from 'dompurify';
import { useLanguageContext } from './Root';


interface Props {
  ID: string
}

function HTMLContent(props: Props) {
  let filesURL = 'no env route';
  if (language === 'FI') {
    filesURL = process.env.REACT_APP_ROUTES_FI ? process.env.REACT_APP_ROUTES_FI : 'null';
  }
  if (language === 'EN') {
    filesURL = process.env.REACT_APP_ROUTES_EN ? process.env.REACT_APP_ROUTES_EN : 'null';
  }

  const [documentData, setDocumentData] = useState('');
  const [documentImages, setDocumentImages] = useState(Array<string>);

  useEffect(() => {
    // Get HTML file from server
    props.ID && axios.get(filesURL + '/' + props.ID).then((res: any) => {
      if (res.data.images && res.data.images.length > 0) {
        setDocumentImages(res.data.images);
      }
      // Sanitize html and set document data
      setDocumentData(sanitize(res.data.data));
    });
  }, [props]);

  useEffect(() => {
    const images = document.querySelectorAll('.HTMLContent img');
    documentImages.length > 0 && images[0].setAttribute('src', 'data:image/png;base64,' + documentImages[0]);
  }, [documentData, documentImages]);

  return (
      <div className='HTMLContent' dangerouslySetInnerHTML={{__html: documentData}}></div>
  )
}

export default HTMLContent;
