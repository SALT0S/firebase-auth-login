import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { withRouter } from 'react-router-dom';
import Firestore from './Firestore';

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
		<div className='mt-5'>
			<h2 className='text-center'>Ruta protegida</h2>

			{user && <Firestore user={user} />}
		</div>
	);
};

export default withRouter(Admin);
