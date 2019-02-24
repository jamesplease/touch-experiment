import React, { useState, useEffect } from 'react';
import './App.css';
import Popup from './popup/popup';

export default function App() {
  const [isShowingAlert, setIsShowingAlert] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShowingAlert(true);
    }, 3000);
  }, []);

  return (
    <div className="App">
      {isShowingAlert && <Popup onClose={() => setIsShowingAlert(false)} />}
    </div>
  );
}
