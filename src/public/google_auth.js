// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbsFuxhnsX2QlaXBjVrg4xUfPaWQLvEpQ",
  authDomain: "gesticost-48429.firebaseapp.com",
  databaseURL: "https://gesticost-48429-default-rtdb.firebaseio.com",
  projectId: "gesticost-48429",
  storageBucket: "gesticost-48429.appspot.com",
  messagingSenderId: "195690817994",
  appId: "1:195690817994:web:6c02d66945550466f2c733",
  measurementId: "G-CQ55NCGRVF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const google_login = document.getElementById('google-login');
google_login.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log(user);
        const idToken = await user.getIdToken();
        // localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('name', user.displayName);
        localStorage.setItem('idToken', idToken);
        window.location.href = '/transacciones';
    } catch (error) {
        console.error(error);
    }
});



