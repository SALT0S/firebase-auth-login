import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import moment from 'moment';
import 'moment/locale/es';

const Firestore = props => {
	const [tareas, setTareas] = useState([]);
	const [tarea, setTarea] = useState('');
	const [edicion, setEdicion] = useState(false);
	const [id, setId] = useState('');
	const [error, setError] = useState(null);

	useEffect(() => {
		const obtenerDatos = async () => {
			try {
				const data = await db.collection(props.user.uid).get();
				const arrayData = data.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
				setTareas(arrayData);
			} catch (error) {
				console.log(error);
			}
		};
		obtenerDatos();
	}, [props.user.uid]);

	const agregar = async e => {
		e.preventDefault();

		if (!tarea.trim()) {
			setError('Ingrese una tarea por favor...');
			return;
		}

		try {
			const nuevaTarea = {
				name: tarea,
				fecha: Date.now(),
			};

			const data = await db.collection(props.user.uid).add(nuevaTarea);
			setTareas([...tareas, { ...nuevaTarea, id: data.id }]);
			setTarea('');
			setError(null);
		} catch (error) {
			console.log(error);
		}
	};

	const eliminar = async id => {
		try {
			await db.collection(props.user.uid).doc(id).delete();
			const arrayFiltrado = tareas.filter(item => item.id !== id);
			setTareas(arrayFiltrado);
		} catch (error) {
			console.log(error);
		}
	};

	const activarEdicion = item => {
		setEdicion(true);
		setTarea(item.name);
		setId(item.id);
	};

	const editar = async e => {
		e.preventDefault();

		if (!tarea.trim()) {
			setError('Ingrese una tarea por favor...');
			return;
		}

		try {
			await db.collection(props.user.uid).doc(id).update({
				name: tarea,
			});
			const arrayEditado = tareas.map(item =>
				item.id === id
					? { id: item.id, fecha: item.fecha, name: tarea }
					: item
			);
			setTareas(arrayEditado);
			setEdicion(false);
			setTarea('');
			setId('');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='container mt-3'>
			<div className='row'>
				<div className='col-md-6'>
					<ul className='list-group'>
						{tareas.map(item => (
							<li
								className='list-group-item d-flex justify-content-between'
								key={item.id}
							>
								{item.name} - {moment(item.fecha).format('ll')}
								<div>
									<button
										className='btn btn-warning btn-sm me-2'
										onClick={() => activarEdicion(item)}
									>
										Editar
									</button>

									<button
										className='btn btn-danger btn-sm'
										onClick={() => eliminar(item.id)}
									>
										Eliminar
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>

				<div className='col-md-6'>
					<h3>{edicion ? 'Editar tarea' : 'Agregar tarea'}</h3>
					<form onSubmit={edicion ? editar : agregar}>
						{error ? (
							<span className='text-danger'>{error}</span>
						) : null}
						<input
							type='text'
							placeholder='Ingrese tarea'
							className='form-control mb-2'
							onChange={e => setTarea(e.target.value)}
							value={tarea}
						/>

						{edicion ? (
							<button
								className='btn btn-warning btn-block w-100'
								type='submit'
							>
								Editar
							</button>
						) : (
							<button
								className='btn btn-dark btn-block w-100'
								type='submit'
							>
								Agregar
							</button>
						)}
					</form>
				</div>
			</div>
		</div>
	);
};

export default Firestore;
