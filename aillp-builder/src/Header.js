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
        <button onClick={() => navigate('/info')}>AI Basics</button>
        <button onClick={() => window.location.href = 'mailto:elinorpd@media.mit.edu'}>Contact Us</button>
      </div>
        <h1>AI Lesson Plan Builder</h1>
        <h3 style={{ textAlign: 'center' }}>A GPT powered tool for middle school educators to improve and incorporate AI literacy into lesson plans.</h3>
        
          {displayGetStartedButton && (
            <>
            <div className='buttons'>
            <button type='button' className='start-button' onClick={onClick}>Get Started</button>
            </div>
            <h3>Need help? See a <a href="https://drive.google.com/drive/folders/1tQS815e0UOcCr0fMouGUb54_w3nb6AiL?usp=sharing" target="_blank" style={{ color: 'white' }}>tutorial here </a> 
        and learn more about the <Link to="/info" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}> Basics of AI here</Link>.</h3>
            </>
          )}
      
    </header>
  );
}

export default Header;
