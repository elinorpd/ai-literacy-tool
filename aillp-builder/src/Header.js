// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Header({ onClick }) {
    const navigate = useNavigate();

  return (
    <header className="App-header">
      <div className="nav-buttons">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/info')}>Info</button>
      </div>
        <h1>AI Lesson Plan Builder</h1>
        <h3>A GPT-4 powered tool for middle school educators to improve and incorporate AI literacy into lesson plans.</h3>
        <div className='buttons'>
          <button type='button' className='start-button' onClick={onClick}>Get Started</button>
        </div>
    </header>
  );
}

export default Header;
