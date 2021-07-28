import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import moment from 'moment';
import 'moment/locale/es';

const Firestore = props => {
	const [tareas, setTareas] = useState([]);
	const [tarea, setTarea] = useState('');
	const [fechaTarea, setFechaTarea] = useState('');
	const [fechaHora, setFechaHora] = useState('');
	const [edicion, setEdicion] = useState(false);
	const [id, setId] = useState('');
	const [error, setError] = useState(null);
	const [ultimo, setUltimo] = React.useState(null);
	const [desactivar, setDesactivar] = React.useState(false);

	useEffect(() => {
		const obtenerDatos = async () => {
			try {
				setDesactivar(true);
				const data = await db
					.collection(props.user.uid)
					.limit(5)
					.orderBy('fecha', 'desc')
					.get();
				const arrayData = data.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}));
				setUltimo(data.docs[data.docs.length - 1]);

				setTareas(arrayData);

				const query = await db
					.collection(props.user.uid)
					.limit(5)
					.orderBy('fecha', 'desc')
					.startAfter(data.docs[data.docs.length - 1])
					.get();
				if (query.empty) {
					setDesactivar(true);
				} else {
					setDesactivar(false);
				}
			} catch (error) {
				console.log(error);
			}
		};
		obtenerDatos();
	}, [props.user.uid]);

	const siguiente = async e => {
		try {
			const data = await db
				.collection(props.user.uid)
				.limit(5)
				.orderBy('fecha', 'desc')
				.startAfter(ultimo)
				.get();
			const arrayData = data.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}));
			setTareas([...tareas, ...arrayData]);
			setUltimo(data.docs[data.docs.length - 1]);
			const query = await db
				.collection(props.user.uid)
				.limit(5)
				.orderBy('fecha', 'desc')
				.startAfter(data.docs[data.docs.length - 1])
				.get();
			if (query.empty) {
				setDesactivar(true);
			} else {
				setDesactivar(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

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
								<div className='col-md-6 text-break'>
									{item.name}
								</div>
								<div className='align-self-center'>
									{moment(item.fecha).format('L')}
								</div>

								<div className='align-self-center'>
									<button
										className='btn btn-warning btn-sm me-2'
										onClick={() => activarEdicion(item)}
									>
										Editar
									</button>

									<button
										className='btn btn-danger btn-sm align-middle'
										onClick={() => eliminar(item.id)}
									>
										Eliminar
									</button>
								</div>
							</li>
						))}
					</ul>
					<button
						className='btn btn-info w-100 mt-2 btn-sm'
						onClick={() => siguiente()}
						disabled={desactivar}
					>
						Siguiente
					</button>
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

						<div className='d-flex justify-content-between  mb-2'>
							<input
								type='date'
								className='form-control me-4'
								onChange={e => setFechaTarea(e.target.value)}
								value={fechaTarea}
							/>

							<input
								type='time'
								className='form-control ms-4'
								onChange={e => setFechaHora(e.target.value)}
								value={fechaHora}
							/>
						</div>

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
