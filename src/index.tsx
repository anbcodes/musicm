import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/index.js';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import { Project } from './pages/Project.js';
import { EditChordChart } from './pages/EditChordChart.js';
import { Setlist } from './pages/Setlist.js';
import { Lyrics } from './pages/Lyrics.js';
import { SlideShow } from './pages/SlideShow.js';
import { SlideShowPresenter } from './pages/SlideShowPresenter.js';
import { Import } from './pages/Import.js';

export function App() {
	return (
		<LocationProvider>
			<Header />
			<main class="pb-[200px]">
				<Router>
					<Route path="/" component={Home} />
					<Route path="/p/:id" component={Project} />
					<Route path="/p/:pid/c/:id" component={EditChordChart} />
					<Route path="/p/:pid/s/:id" component={Setlist} />
					<Route path="/p/:pid/l/:id" component={Lyrics} />
					<Route path="/p/:pid/ss/:id" component={SlideShow} />
					<Route path="/p/:pid/ss/:id/view" component={SlideShowPresenter} />
					<Route path="/import/:enc" component={Import} />
					<Route default component={NotFound} />
				</Router>
			</main>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
