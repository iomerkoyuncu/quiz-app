import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Quiz from './components/Quiz';
import Welcome from './components/Welcome';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Router>
  );
}

export default App;