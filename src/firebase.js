import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyByb7AFaYx4o7XV8rB-6mYnpWPwOeiWWV4",
  authDomain: "whatsappclone-dc909.firebaseapp.com",
  databaseURL: "https://whatsappclone-dc909.firebaseio.com",
  projectId: "whatsappclone-dc909",
  storageBucket: "whatsappclone-dc909.appspot.com",
  messagingSenderId: "173133280593",
  appId: "1:173133280593:web:63b985d3a70bc8f5d0cf70",
  measurementId: "G-XCTEQTX3DQ"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth, provider};
export default db;