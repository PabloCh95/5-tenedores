import firebase from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBqfmR6b6B3MQU96ik_Yd_WYv6aex5VE5E",
    authDomain: "tenedores-6aecb.firebaseapp.com",
    databaseURL: "https://tenedores-6aecb.firebaseio.com",
    projectId: "tenedores-6aecb",
    storageBucket: "tenedores-6aecb.appspot.com",
    messagingSenderId: "1012816475227",
    appId: "1:1012816475227:web:bd8b7feb4682bc21887b7e"
  };

  export const firebaseApp = firebase.initializeApp(firebaseConfig);