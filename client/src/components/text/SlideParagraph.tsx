import './SlideParagraph.scss';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import LanguageContext from '../../contexts/LanguageContext';
import { DataContext } from '../../contexts/DataContext';
import { AnimationContext } from '../../contexts/AnimationContext';


interface SlideParagraphProps {
  previousText: string;
  upcomingText: string;
}

function SlideParagraph(props: SlideParagraphProps) {
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
