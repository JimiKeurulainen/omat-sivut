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
  // const [trigger, setTrigger] = useState<boolean>(false);

  // useEffect(() => {
  //   setTrigger(true);
  //   // // document.getElementById('Previous')?.classList.add('Previous');
  //   // document.getElementById('Previous')?.classList.remove('Upcoming');
  //   // // document.getElementById('Upcoming')?.classList.add('Upcoming');
  //   // document.getElementById('Upcoming')?.classList.remove('Previous');
  // }, []);
 
  return (
    <span className={`
      SlideParagraph
    `}>
      <span className='Previous'>{props.previousText.replaceAll('_', ' ')}</span>
      <span className='Upcoming'>{props.upcomingText.replaceAll('_', ' ')}</span>
    </span>
  )
}

export default SlideParagraph;
