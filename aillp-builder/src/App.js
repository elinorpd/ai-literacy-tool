import React, { useState, useRef, useEffect} from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import './App.css';
import MainPage from './MainPage'; // Import the main page component
import InfoPage from './InfoPage'; // Import the info page component



function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/info" element={<InfoPage />} />
        </Routes>
    </Router>
  );
}


export default App;
