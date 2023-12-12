import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Header({ onClick }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isNotInfoPage = location.pathname !== '/info';

    return (
      <header className="App-header">
        <div className="nav-buttons">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/info')}>AI Basics</button>
          <button onClick={() => window.location.href = 'mailto:elinorpd@media.mit.edu'}>Contact Us</button>
        </div>
        <h1>AI Lesson Plan Builder</h1>
        <h3 style={{ textAlign: 'center' }}>A GPT powered tool for middle school educators to improve and incorporate AI literacy into lesson plans.</h3>
        <div className='buttons'>
          {isNotInfoPage && (
            <button type='button' className='start-button' onClick={onClick}>Get Started</button>
          )}
        </div>
        <h3>
          {isNotInfoPage && (
            <>
              Need help? Learn more about{' '}
              <Link to="/info" target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                basics of AI here
              </Link>
              &nbsp;and&nbsp;
            </>
          )}
          watch a 
          <a href="https://drive.google.com/drive/folders/1tQS815e0UOcCr0fMouGUb54_w3nb6AiL?usp=sharing" target="_blank" style={{ color: 'white' }}> tutorial here 
          </a> 
          &nbsp;on using the tool
        </h3>
      </header>
    );
}
export default Header;
