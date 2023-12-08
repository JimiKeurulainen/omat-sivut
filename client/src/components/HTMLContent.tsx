import './HTMLContent.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { sanitize } from 'dompurify';
import { useLanguageContext } from './Root';
import { useLocation, useNavigate } from 'react-router-dom';


interface Props {
  ID: string
}

function HTMLContent({ID}: Props) {
  let filesURL = 'no env route';
  const {language} = useLanguageContext();
  const location = useLocation();
  const navigateURL = useNavigate();

  const [documentData, setDocumentData] = useState('');
  const [documentImages, setDocumentImages] = useState(Array<string>);

  useEffect(() => {
    if (language === 'FI') {
      filesURL = process.env.REACT_APP_FILES_FI ? process.env.REACT_APP_FILES_FI : 'null';
    }
    if (language === 'EN') {
      filesURL = process.env.REACT_APP_FILES_EN ? process.env.REACT_APP_FILES_EN : 'null';
    }
    // Get HTML file from server
    ID && axios.get(filesURL + ID).then((res: any) => {
      if (res.data.images && res.data.images.length > 0) {
        setDocumentImages(res.data.images);
      }
      // Sanitize html and set document data
      setDocumentData(sanitize(res.data.data));
    });
    console.log('ID', ID);
  }, [ID, language]);

  useEffect(() => {
    const pathComponents = location.pathname.split('/');
    const IDComponents = ID.split('/').map(comp => {
      console.log('comp', comp, comp.slice(2));
      return comp.slice(2);
    });
    console.log('location', pathComponents, IDComponents);

    if (ID && pathComponents.length !== 5 && pathComponents[2] === IDComponents[0]) {
      navigateURL('/' + language + '/' + IDComponents.toString().replaceAll(',', '/'));
    }
  }, [location]);

  useEffect(() => {
    const images = document.querySelectorAll('.HTMLContent img');
    documentImages.length > 0 && images[0].setAttribute('src', 'data:image/png;base64,' + documentImages[0]);
  }, [documentData, documentImages]);

  return (
      <div className='HTMLContent' dangerouslySetInnerHTML={{__html: documentData}}></div>
  )
}

export default HTMLContent;
