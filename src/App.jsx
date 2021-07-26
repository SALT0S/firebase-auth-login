import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from '../src/components/Navbar';
import Admin from './components/Admin';
import Login from './components/Login';
import Reset from './components/Reset';
import { auth } from './firebase';

function App() {
	const [firebaseUser, setFirebaseUser] = useState(false);

	useEffect(() => {
		auth.onAuthStateChanged(user => {
			if (user) {
				setFirebaseUser(user);
			} else {
				setFirebaseUser(null);
			}
		});
	}, []);

	return firebaseUser !== false ? (
		<Router>
			<header>
				<Navbar firebaseUser={firebaseUser} />
			</header>
			<div className='container'>
				<Switch>
					<Route path='/reset'>
						<Reset />
					</Route>
					<Route path='/login'>
						<Login />
					</Route>
					<Route path='/admin'>
						<Admin />
					</Route>
					<Route path='/' exact>
						Ruta de inicio
					</Route>
				</Switch>
			</div>
		</Router>
	) : (
		<p>Cargando....</p>
	);
}

export default App;
