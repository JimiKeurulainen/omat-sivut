import './HTMLContent.scss';
import { useContext, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { sanitize } from 'dompurify';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';
import { axiosInstance } from '../axiosInstance';
import { getHtml } from '../api/html';
import parse from 'html-react-parser';


interface Props {
  ID: string
}
interface Data {
  data: string,
  images: Array<string>
}

function HTMLContent({ID}: Props) {
  const {language} = useContext(LanguageContext);

  const [documentData, setDocumentData] = useState('');
  const [documentImages, setDocumentImages] = useState(Array<string>);
  const [fragment, setFragment] = useState<any>();

  useEffect(() => {
    // Get HTML file from server
    ID && getHtml(ID).then(({data}) => {
      console.log('DATA', data);
      if (data.images && data.images.length > 0) {
        setDocumentImages(data.images);
      }
      // Sanitize html and set document data
      setDocumentData(sanitize(data.data));
    });
  }, [ID, language]);

  // useEffect(() => {
  //   const pathComponents = location.pathname.split('/');
  //   const IDComponents = ID.split('/').map(comp => {
  //     return comp.slice(2);
  //   });

  //   if (ID && pathComponents.length !== 5 && pathComponents[2] === IDComponents[0]) {
  //     navigateURL('/' + language + '/' + IDComponents.toString().replaceAll(',', '/'));
  //   }
  // }, [location]);

  useEffect(() => {
    const parsed = parse(documentData);
    const westerns = document.getElementsByClassName("western");

    for (let i = 0; i < westerns.length; i++) {
      console.log('ELEM', westerns[i]);

      setTimeout(() => westerns[i].classList.add("anim1"), 100 * i)
      ;
    }
    // const p = parse(documentData);
    // console.log('DOCUMENT DATA', p, documentData.split(/<p\b[^>]*>.*?<\/p>/gmi));
    // const images = document.querySelectorAll('.HTMLContent img');
    // documentImages.length > 0 && images[0].setAttribute('src', 'data:image/png;base64,' + documentImages[0]);
  }, [documentData, documentImages]);

  // useEffect(() => {
  //   console.log('FRAGMENT', fragment);
  // }, [fragment]);

  return (
    <div className='HTMLContent'>
      {parse(documentData)}
    </div>
  )
}

export default HTMLContent;
