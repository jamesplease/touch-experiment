import React, { useRef, useState } from 'react';
import './popup.css';
import useDrag from './use-drag';

export default function Popup() {
  const [topPixels, setTopPixels] = useState(50);
  const el = useRef();

  useDrag(el, topPixels, setTopPixels);

  return (
    <div ref={el} className="popup" style={{top: `${topPixels}px`}}>
      Popup
    </div>
  )
}