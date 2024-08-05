import './NavbarButton.scss';
import { PositionContext } from '../../contexts/PositionContext';
import { useContext, useEffect } from 'react';
import CustomCaret from '../icons/CustomCaret';
import SlideParagraph from '../text/SlideParagraph';


interface NavbarButtonProps {
  index: number;
  function: (attr?: string) => void;
  initialized: boolean;
  active: boolean;
}

function NavbarButton(props: NavbarButtonProps) {
  const { vertical } = useContext(PositionContext);

  return (
    <button
      className={`
        Nappi
        ${vertical ? 'Down' : 'Up'}
        ${props.initialized ? 'Initialized' : 'Uninitialized'} 
        ${props.active && 'Active'}
      `}
      key={`nappi${props.index}`}
      onClick={() => props.function()}
    >
      <div key={`nappiBG${props.index}`} />
      <CustomCaret />
      <p>
        <SlideParagraph 
          triggerAnim={props.initialized}
          translatable={props.active ? 'toFrontPage' : ''}
          indices={[props.index]}
        />
      </p>
    </button>
  )
}

export default NavbarButton;
