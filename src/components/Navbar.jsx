import React from 'react';
import { auth } from '../firebase';
import { Link, NavLink } from 'react-router-dom';

import { withRouter } from 'react-router-dom';

const Navbar = props => {
	const cerrarSesion = () => {
		auth.signOut().then(() => {
			props.history.push('./login');
		});
	};
	return (
		<nav className='navbar navbar-dark bg-dark '>
			<div className='container'>
				<Link className='navbar-brand ' to='/'>
					AUTH
				</Link>

				<div className='d-flex'>
					<NavLink
						className='btn btn-dark me-2 shadow-none'
						to='/'
						exact
						activeClassName='active'
					>
						Inicio
					</NavLink>

					{props.firebaseUser !== null ? (
						<NavLink
							className='btn btn-dark me-2 shadow-none'
							to='/admin'
							activeClassName='active'
						>
							Admin
						</NavLink>
					) : null}

					{props.firebaseUser !== null ? (
						<NavLink
							className='btn btn-dark me-2 shadow-none'
							to='/login'
							onClick={() => cerrarSesion()}
						>
							Cerrar Sesión
						</NavLink>
					) : (
						<NavLink
							className='btn btn-dark me-2 shadow-none'
							to='/login'
							activeClassName='active'
						>
							Login
						</NavLink>
					)}
				</div>
			</div>
		</nav>
	);
};

export default withRouter(Navbar);
