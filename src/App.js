import React, { useState, useEffect } from 'react';
import './App.css';
import Popup from './popup/popup';
import Overlay from './overlay/overlay';

export default function App() {
  const [isShowingAlert, setIsShowingAlert] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShowingAlert(true);
    }, 1800);
  }, []);

  return (
    <div className="App">
      {isShowingAlert && <Popup onClose={() => setIsShowingAlert(false)} />}
      <button
        className="showAlert"
        onClick={() => setIsShowingAlert(true)}
        disabled={isShowingAlert}>
        Show Alert
      </button>
      <Overlay />
    </div>
  );
}
