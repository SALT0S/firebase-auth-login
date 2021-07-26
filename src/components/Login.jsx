import React, { useState, useCallback } from 'react';
import { auth, db } from '../firebase';
import { withRouter } from 'react-router-dom';

const Login = props => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [error, setError] = useState(null);
	const [registro, setRegistro] = useState(true);

	const procesarDatos = e => {
		e.preventDefault();
		if (!email.trim()) {
			setError('Ingresa un email válido.');
			return;
		}
		if (!pass.trim()) {
			setError('Ingrese contraseña');
			return;
		}

		if (pass.length < 6) {
			setError('La contraseña debe tener entre 6 y 60 caracteres');
			return;
		}

		setError(null);

		if (registro) {
			registrar();
		} else {
			Login();
		}
	};

	const Login = useCallback(async () => {
		try {
			await auth.signInWithEmailAndPassword(email, pass);
			setEmail('');
			setPass('');
			setError(null);
			props.history.push('/admin');
		} catch (error) {
			if (error.code === 'auth/invalid-email') {
				setError(
					'La dirección de correo electrónico está mal formateada.'
				);
			} else if (error.code === 'auth/user-not-found') {
				setError(
					'No hay ningún registro de usuario que corresponda a este identificador.'
				);
			} else if (error.code === 'auth/wrong-password') {
				setError('La contraseña no es válida.');
			}
		}
	}, [email, pass, props.history]);

	const registrar = useCallback(async () => {
		try {
			const res = await auth.createUserWithEmailAndPassword(email, pass);
			await db.collection('usuarios').doc(res.user.email).set({
				email: res.user.email,
				uid: res.user.uid,
			});
			setEmail('');
			setPass('');
			setError(null);
			props.history.push('/admin');
		} catch (error) {
			if (error.code === 'auth/invalid-email') {
				setError(
					'La dirección de correo electrónico está mal formateada.'
				);
			} else if (error.code === 'auth/email-already-in-use') {
				setError(
					'La dirección de correo electrónico ya está siendo utilizada por otra cuenta.'
				);
			}
		}
	}, [email, pass, props.history]);

	return (
		<div className='mt-5'>
			<h3 className='text-center'>
				{registro ? 'Registro de usuarios' : 'Iniciar sesión'}
			</h3>
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

						<input
							type='password'
							className='form-control mb-2'
							placeholder='Contraseña'
							onChange={e => setPass(e.target.value)}
							value={pass}
						/>

						<button
							className='btn btn-dark btn-lg w-100 shadow-none mb-2'
							type='submit'
						>
							{registro ? 'Registrarte' : 'Iniciar sesión'}
						</button>

						<button
							className='btn btn-outline-secondary btn-sm w-100 shadow-none'
							onClick={() => setRegistro(!registro)}
							type='button'
						>
							{registro
								? '¿Ya tienes una cuenta?'
								: '¿No tienes cuenta?'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default withRouter(Login);
