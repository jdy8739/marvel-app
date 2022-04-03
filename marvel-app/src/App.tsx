import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Characters from './routes/Characters';
import Home from './routes/Characters';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/characters' element={ <Characters /> } />
          <Route path="/*" element={ <Home /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
