import firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyD9Yt-OCnavtLsSG12gkE7_oSlXhzeKB2Y",
  authDomain: "phit-db.firebaseapp.com",
  databaseURL: "https://phit-db.firebaseio.com",
  projectId: "phit-db",
  storageBucket: "phit-db.appspot.com",
  messagingSenderId: "337801473738"
};
firebase.initializeApp(config);

export const auth = firebase.auth();
export const storage = firebase.storage();
// Add a realtime Listner
