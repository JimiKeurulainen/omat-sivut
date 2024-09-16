import './SlideParagraph.scss';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../contexts/LanguageContext';
import { DataContext } from '../../contexts/DataContext';
import { AnimationContext } from '../../contexts/AnimationContext';


interface SlideParagraphProps {
  // triggerAnim: boolean;
  previousText: string;
  upcomingText: string;
}

function SlideParagraph(props: SlideParagraphProps) {
  const [trigger, setTrigger] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const { language, previousLanguage } = useContext(LanguageContext);
  const { data } = useContext(DataContext);
  const { activeCategory } = useContext(AnimationContext);

  // useEffect(() => {
  //   // setTrigger(true);
  //   switch (props.indices?.length) {
  //     case 1:
  //       setCurrentTitle(Object.keys(data[language])[props.indices[0]]);
  //       setPreviousTitle(Object.keys(data[previousLanguage])[props.indices[0]]);
  //     case 2:
  //       setCurrentTitle(Object.keys(data[language])[props.indices[0]]);
  //       setPreviousTitle(Object.keys(data[previousLanguage])[props.indices[0]]);
  //     case 3:
  //       setCurrentTitle(Object.keys(data[language])[props.indices[0]]);
  //       setPreviousTitle(Object.keys(data[previousLanguage])[props.indices[0]]);
  //   }
  // }, [language]);

  useEffect(() => {
    setCounter(counter + 1);
  }, [props.previousText]);

  useEffect(() => {
    console.log('TRIGGER',  trigger);
    setTrigger(true);

    setTimeout(() => {
      setTrigger(false);
    }, 1000);
  }, [counter]);
 
  return (
    <span className={`
      SlideParagraph
      ${trigger ? 'Initialized' : 'Unitialized'}
    `}>
      <span className='Previous'>{props.previousText.replaceAll('_', ' ')}</span>
      <span className='Upcoming'>{props.upcomingText.replaceAll('_', ' ')}</span>
    </span>
  )
}

export default SlideParagraph;
