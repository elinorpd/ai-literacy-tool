import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Header({ onClick }) {
    const navigate = useNavigate();
    const location = useLocation();

    const displayGetStartedButton = location.pathname !== '/info';

  return (
    <header className="App-header">
      <div className="nav-buttons">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/info')}>Info</button>
        <button onClick={() => window.location.href = 'mailto:elinorpd@media.mit.edu'}>Contact Us</button>
      </div>
        <h1>AI Lesson Plan Builder</h1>
        <h3 style={{ textAlign: 'center' }}>A GPT powered tool for middle school educators to improve and incorporate AI literacy into lesson plans.</h3>
        <div className='buttons'>
          {displayGetStartedButton && (
            <button type='button' className='start-button' onClick={onClick}>Get Started</button>
          )}
      </div>
    </header>
  );
}

export default Header;
