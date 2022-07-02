import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import Navigation from './components/Navigation';
// import Characters from './routes/characters/Characters';
// import CharactersDetail from './routes/character_detail/CharactersDetail';
// import Comics from './routes/comics/Comics';
// import ComicsDetail from './routes/comics_detail/ComicsDetail';
// import Events from './routes/events/Events';
// import EventsDetail from './routes/events_detail/EventsDetail';
import Home from './routes/Home';
// import Series from './routes/series/Series';
// import SeriesDetail from './routes/series_detail/SeriesDetail';
import React from 'react';

function App() {
	return (
		<div className="App">
			<RecoilRoot>
				<BrowserRouter>
					<Navigation />
					<Routes>
						{/* <Route
							path="/characters/detail/:id/*"
							element={<CharactersDetail />}
						/>
						<Route path="/characters/*" element={<Characters />} />
						<Route
							path="/comics/detail/:id/*"
							element={<ComicsDetail />}
						/>
						<Route path="/comics/*" element={<Comics />} />
						<Route
							path="/series/detail/:id/*"
							element={<SeriesDetail />}
						/>
						<Route path="/series/*" element={<Series />} />
						<Route
							path="/events/detail/:id/*"
							element={<EventsDetail />}
						/> */}
						{/* <Route path="/events/*" element={<Events />} /> */}
						<Route path="/*" element={<Home />} />
					</Routes>
				</BrowserRouter>
			</RecoilRoot>
		</div>
	);
}

export default App;
