import firebase from "firebase/app";
import  "firebase/auth";
import 'firebase/database';
import 'firebase/storage';

const config={
    apiKey: "AIzaSyAVBy6uzxbT_byD428Dlo0ZXzW0OWYACC0",
    authDomain: "chat-web-app-87ffb.firebaseapp.com",
    databaseURL: "https://chat-web-app-87ffb-default-rtdb.firebaseio.com",
    projectId: "chat-web-app-87ffb",
    storageBucket: "chat-web-app-87ffb.appspot.com",
    messagingSenderId: "687912018693",
    appId: "1:687912018693:web:bc5952aac037ac9cd20d6c"
  };

 const app = firebase.initializeApp(config);

 export const auth=app.auth();
 export const database=app.database();
 export const storage =app.storage();