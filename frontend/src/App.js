import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  const API_ENDPOINT = process.env.KISSA_API_ENDPOINT || 'http://localhost:8080';
  console.log(process.env);
  console.log(API_ENDPOINT);

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
        <p>{message}</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
