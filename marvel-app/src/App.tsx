import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Navigation from './components/Navigation';
import Characters from './routes/Characters';
import CharactersDetail from './routes/CharactersDetail';
import Comics from './routes/Comics';
import ComicsDetail from './routes/ComicsDetail';
import Home from './routes/Home';
import Series from './routes/Series';
import SeriesDetail from './routes/SeriesDetail';

function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
        <Navigation />
          <Routes>
            <Route path='/characters/detail/:id/*' element={ <CharactersDetail /> } />
            <Route path='/characters/*' element={ <Characters /> } />
            <Route path='/comics/detail/:id/*' element={ <ComicsDetail /> } />
            <Route path='/comics/*' element={ <Comics /> } />
            <Route path='/series/detail/:id/*' element={ <SeriesDetail /> } />
            <Route path='/series/*' element={ <Series /> } />
            <Route path="/*" element={ <Home /> } />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
