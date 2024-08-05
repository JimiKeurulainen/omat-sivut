import './SlideParagraph.scss';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../contexts/LanguageContext';
import { DataContext } from '../../contexts/DataContext';


interface SlideParagraphProps {
  triggerAnim: boolean;
  translatable: string;
  indices?: number[];
}

function SlideParagraph(props: SlideParagraphProps) {
  const [currentTitle, setCurrentTitle] = useState<string>('');
  const [previousTitle, setPreviousTitle] = useState<string>('');

  const { t } = useTranslation();
  const { language, previousLanguage } = useContext(LanguageContext);
  const { data } = useContext(DataContext);

  useEffect(() => {
    if (props.translatable !== '') {
      setCurrentTitle(t(props.translatable));
      setPreviousTitle(t(props.translatable, {lng: previousLanguage}));
    }
    else if (props.indices) {
      switch (props.indices.length) {
        case 1:
          setCurrentTitle(Object.keys(data[language])[props.indices[0]]);
          setPreviousTitle(Object.keys(data[previousLanguage])[props.indices[0]]);
        case 2:
          setCurrentTitle(Object.keys(data[language])[props.indices[0]]);
          setPreviousTitle(Object.keys(data[previousLanguage])[props.indices[0]]);
        case 3:
          setCurrentTitle(Object.keys(data[language])[props.indices[0]]);
          setPreviousTitle(Object.keys(data[previousLanguage])[props.indices[0]]);
      }
    }
  }, [language, props.translatable]);

  return (
    <span className={`
      SlideParagraph
      ${props.triggerAnim ? 'Initialized' : 'Uninitialized'}
    `}>
      <span className='Previous'>{previousTitle.replaceAll('_', ' ')}</span>
      <span className='Current'>{currentTitle.replaceAll('_', ' ')}</span>
    </span>
  )
}

export default SlideParagraph;
