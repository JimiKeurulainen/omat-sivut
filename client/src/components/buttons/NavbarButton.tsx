import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './NavbarButton.scss';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { PositionContext } from '../../contexts/PositionContext';
import { useContext } from 'react';


interface NavbarButtonProps {
  title: string;
  function: (attr?: string) => void;
  initialized: boolean;
  active: boolean;
}

function NavbarButton(props: NavbarButtonProps) {
  const { t } = useTranslation();
  const { vertical } = useContext(PositionContext);

  return (
    <button
      className={`
        Nappi
        ${vertical ? 'Down' : 'Up'}
        ${props.initialized ? 'Initialized' : 'Uninitialized'} 
        ${props.active ? 'Active' : 'Inactive'}
      `}
      key={`nappi${props.title}`}
      onClick={() => props.function()}
    // ref={(el: HTMLButtonElement) => categoryRefs.current[index] = el}
    >
      <div key={`nappiBG${props.title}`}></div>
      <FontAwesomeIcon icon={faCaretUp} className='CaretIcon'/>
      <p className='Etusivulle'>{t('toFrontPage')}</p>
      <p className='CategoryTitle'>{props.title.replace('_', ' ')}</p>
    </button>
  )
}

export default NavbarButton;
