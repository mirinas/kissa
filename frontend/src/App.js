import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Login from './components/Login';

function App() {
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_ENDPOINT = process.env.REACT_APP_KISSA_API_ENDPOINT || 'http://localhost:8080';

  const handleClick = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/`);
      const data = await response.json();
      setMessage(data.message);
    } 
    catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = (status) => {
    setIsLoggedIn(status);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <Login onLogin={handleLogin} />;
    } 
    else {
      return (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Edit <code>src/App.js</code> and save to reload. Deploy tested.</p>
          <button onClick={handleClick}>Fetch API</button>
          <p>{message}</p>
          <a href="https://reactjs.org">Learn React</a>
        </header>
      );
    }
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;
