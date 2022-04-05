import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Navigation from './components/Navigation';
import Characters from './routes/Characters';
import CharactersDetail from './routes/CharactersDetail';
import Home from './routes/Home';

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
        <Navigation />
          <Routes>
            <Route path='/characters/detail/:id/*' element={ <CharactersDetail /> } />
            <Route path='/characters/*' element={ <Characters /> } />
            <Route path="/*" element={ <Home /> } />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
