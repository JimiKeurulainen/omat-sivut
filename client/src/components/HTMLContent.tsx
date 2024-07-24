import './HTMLContent.scss';
import { useContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { sanitize } from 'dompurify';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';


interface Props {
  ID: string
}
interface Data {
  data: string,
  images: Array<string>
}

function HTMLContent({ID}: Props) {
  let filesURL = 'no env route';
  const {language} = useContext(LanguageContext);
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
    ID && axios.get(filesURL + ID).then(({data}: AxiosResponse) => {
      if (data.images && data.images.length > 0) {
        setDocumentImages(data.images);
      }
      // Sanitize html and set document data
      setDocumentData(sanitize(data.data));
    });
  }, [ID, language]);

  useEffect(() => {
    const pathComponents = location.pathname.split('/');
    const IDComponents = ID.split('/').map(comp => {
      return comp.slice(2);
    });

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
