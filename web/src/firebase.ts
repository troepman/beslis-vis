// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyBzE2PGiWlPBnp5JNTi5IwKuKttcD0y3yg',
    authDomain: 'beslis-vis.firebaseapp.com',
    projectId: 'beslis-vis',
    storageBucket: 'beslis-vis.appspot.com',
    messagingSenderId: '938445007699',
    appId: '1:938445007699:web:d829f67bc0b134b05fcfa6',
    measurementId: 'G-W9K19P5Q0Z',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
