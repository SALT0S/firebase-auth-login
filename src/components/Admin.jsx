import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { withRouter } from 'react-router-dom';

const Admin = props => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (auth.currentUser) {
			setUser(auth.currentUser);
		} else {
			props.history.push('/login');
		}
	}, [props.history]);

	return (
		<div>
			<h2>Ruta protegida</h2>

			{user && <h3>{user.email}</h3>}
		</div>
	);
};

export default withRouter(Admin);
