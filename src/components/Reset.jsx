import React, { useState, useCallback } from 'react';
import { auth } from '../firebase';
import { withRouter } from 'react-router-dom';

const Reset = props => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);

	const procesarDatos = e => {
		e.preventDefault();
		if (!email.trim()) {
			setError('Ingresa un email válido.');
			return;
		}

		setError(null);
		recuperar();
	};

	const recuperar = useCallback(async () => {
		try {
			await auth.sendPasswordResetEmail(email);
			props.history.push('/login');
		} catch (error) {
			console.log(error.message);
			if (error.code === 'auth/invalid-email') {
				setError(
					'La dirección de correo electrónico está mal formateada.'
				);
			} else if (error.code === 'auth/user-not-found') {
				setError(
					'No hay ningún registro de usuario que corresponda a este identificador.'
				);
			}
		}
	}, [email, props.history]);

	return (
		<div className='mt-5'>
			<h3 className='text-center'>Recuperar contraseña</h3>
			<hr />
			<div className='row justify-content-center'>
				<div className='col-12 col-sm-8 col-md-6 col-xl-4'>
					<form onSubmit={procesarDatos}>
						{error && (
							<div className='alert alert-danger'>{error}</div>
						)}
						<input
							type='email'
							className='form-control mb-2'
							placeholder='Correo electrónico'
							onChange={e => setEmail(e.target.value)}
							value={email}
						/>

						<button
							className='btn btn-dark btn-lg w-100 shadow-none mb-2'
							type='submit'
						>
							Recuperar contraseña
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default withRouter(Reset);
