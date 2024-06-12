import React from 'react';
import Terminal from './Terminal';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState('');

  useEffect(() => {
    (async function () {
      try {
        const response = await fetch(`/api/message`);
        const jsonData = await response.json();
        setData(jsonData.message); // Ensure this matches the JSON structure from the backend
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    })();
  }, []); // Add dependency array to prevent repeated calls on re-renders

  return (
    <div>
      <Terminal />
      <h1>Calculator - Web CLI tool</h1>
      <p>Commands: <b>calculate</b> <i>calcstring</i>, calcstring = '1+1*23/46'</p>
      <p>Example: <b>calculate</b> <i>3+4-23*9+888</i></p>
      <p>{data}</p>
    </div>
  );
}

export default App;
