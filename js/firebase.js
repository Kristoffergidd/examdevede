import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyABVxssIQCTs1IVeJz06hp3qOqMixQX78M",
    authDomain: "movieexam-28ac6.firebaseapp.com",
    projectId: "movieexam-28ac6",
    storageBucket: "movieexam-28ac6.appspot.com",
    messagingSenderId: "402919323382",
    appId: "1:402919323382:web:2c4863b148a7cf33f3ded7",
    measurementId: "G-YLLQQME70X"
  };
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
 
  export{ db }