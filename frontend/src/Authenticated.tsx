import React, { useState } from 'react';
import 'firebase/auth';
import firebase from 'firebase/app';
import { useEffect } from 'react';
import Posts from './Posts';
import Login from './Login';
import SignUp from './SignUp';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';

const firebaseConfig = {
  apiKey: "AIzaSyAvy1eqUtpAHgoK4ZAOXBb5wf0mklo25MI",
  authDomain: "cublogs-ffa92.firebaseapp.com",
  databaseURL: "https://cublogs-ffa92.firebaseio.com",
  projectId: "cublogs-ffa92",
  storageBucket: "cublogs-ffa92.appspot.com",
  messagingSenderId: "585887986837",
  appId: "1:585887986837:web:dfdcb9790e78cecd69179c"
};

firebase.initializeApp(firebaseConfig);

const Authenticated = () => {
  const [user, setUser] = useState<firebase.User | null>(null);

  function onAuthStateChange() {
    return firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }

  useEffect(() => onAuthStateChange(), []);

  const signup = (email: string, password: string, firstName: string, lastName: string) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCreds) => {
        const user = userCreds && userCreds.user;
        const uid = user?.uid;

        axios.post('/createUser', { uid, firstName, lastName })
          .then(res => { })
          .catch((error) => {
            console.log(error.message);
          });
      });
  }

  const login = (email: string, password: string) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {

      })
      .catch((error) => {
        console.log(error.message);
      });
  }

  return (
    <div>
      {user && <Posts />}
      {!user && <Switch>
        <Route path="/signup">
          <SignUp callback={signup} />
        </Route>
        <Route path="/">
          <Login callback={login} />
        </Route>
      </Switch>}
    </div>
  );
}

export default Authenticated;