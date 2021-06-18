import firebase from "firebase";
//export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

export default function initializeFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConnect);
  } else {
    firebase.app();
  }
}
//funcion para inicializar conexion con firebase
var firebaseConnect = {
  apiKey: "AIzaSyAb8hIwojMmi6YgR0G2tdytNdwLDFRiob4",
  authDomain: "meeting-natives.firebaseapp.com",
  databaseURL:
    "https://meeting-natives-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "meeting-natives",
  storageBucket: "meeting-natives.appspot.com",
  messagingSenderId: "177502839797",
  appId: "1:177502839797:web:bc0254980b5c947738b6bc",
  measurementId: "G-KB24ZY98Q6",
};
