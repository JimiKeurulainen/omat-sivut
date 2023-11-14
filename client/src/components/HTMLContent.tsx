import './HTMLContent.scss';
import { useEffect, useState } from 'react';
import axios from 'axios';


interface Props {
  ID: string
}

function HTMLContent(props: Props) {
  const [documentData, setDocumentData] = useState('');
  const [documentImages, setDocumentImages] = useState(Array<string>);

  useEffect(() => {
    console.log('id', props.ID);
    axios.get(`http://jimikeurulainen.site/content/${props.ID}`).then((res: any) => {
      console.log('res', res);
      if (res.data.images.length > 0) {
        setDocumentImages(res.data.images);
      }
      setDocumentData(res.data.data);
    });
  }, []);

  useEffect(() => {
    const images = document.querySelectorAll('.HTMLContent img');
    console.log('images', images, documentImages);
    documentImages.length > 0 && images[0].setAttribute('src', 'data:image/png;base64,' + documentImages[0]);
  }, [documentData, documentImages]);

  return (
      <div className='HTMLContent' dangerouslySetInnerHTML={{__html: documentData}}></div>
  )
}

export default HTMLContent;
