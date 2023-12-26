import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  const API_ENDPOINT = process.env.REACT_APP_KISSA_API_ENDPOINT || 'http://localhost:8080';

  const handleClick = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/`);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. Deploy tested.
        </p>
        <button onClick={handleClick}>Fetch API</button>
        { message && <h3>Message from API</h3>}
        <p>{message}</p>
      </header>
    </div>
  );
}

export default App;
