import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyDr0tbweVc0iK4HZwWulVNRcUhdmAmZbsY',
	authDomain: 'crud-simple-firebase.firebaseapp.com',
	projectId: 'crud-simple-firebase',
	storageBucket: 'crud-simple-firebase.appspot.com',
	messagingSenderId: '885962972566',
	appId: '1:885962972566:web:502b8909d45f7c791151b7',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };
