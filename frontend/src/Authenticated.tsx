import React, { useState } from 'react';
import 'firebase/auth';
import firebase from 'firebase/app';
import { useEffect } from 'react';
import Posts from './Posts';
import Login from './Login';
import SignUp from './SignUp';
import { Switch, Route, Redirect } from 'react-router-dom';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';

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

type User = {
  uid: string;
  firstName: string;
  lastName: string;
  upvotedPostIDs: string[];
  downvotedPostIDs: string[];
  postIDs: string[];
}

const Authenticated = () => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  // this doesn't seem to work for signup because it tries to get the user before creating them in our user table
  /*function onAuthStateChange() {
    return firebase.auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser !== null) {
        const user = await axios.get<User>(`/getUser?uid=${firebaseUser.uid}`);
        console.log(user.data.firstName);
        setUser(user.data);
      }
      else {
        setUser(null);
      }
    });
  }

  useEffect(() => onAuthStateChange(), []);*/

  const signup = (email: string, password: string, firstName: string, lastName: string) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCreds) => {
        if (userCreds !== null) {
          const user = userCreds.user;
          const uid = user?.uid;
          axios.post('/createUser', { uid, firstName, lastName })
            .then(async (res) => {
              const user = await axios.get<User>(`/getUser?uid=${uid}`);
              setUser(user.data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case ('auth/email-already-in-use'):
            setMessage('Account with this email address already exists!');
            break;
          case ('auth/invalid-email'):
            setMessage('Please enter a valid email!');
            break;
          default:
            setMessage('Sign up unsuccessful!');
        }
        setSnackBarOpen(true);
      });
  }

  const login = (email: string, password: string) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(async (userCreds) => {
        if (userCreds !== null) {
          const uid = userCreds.user?.uid;
          const user = await axios.get<User>(`/getUser?uid=${uid}`);
          setUser(user.data);
        }

      })
      .catch((error) => {
        console.log(error.message);
        switch (error.code) {
          case ('auth/invalid-email'):
            setMessage('Please enter a valid email!');
            break;
          case ('auth/user-not-found'):
            setMessage('Invalid email or password!');
            break;
          case ('auth/wrong-password'):
            setMessage('Invalid email or password!');
            break;
          default:
            setMessage('Log in unsuccessful!');
        }
        setSnackBarOpen(true);
      });
  }

  return (
    <div>
      <Switch>
        <Route path="/signup">
          {user ? <Redirect to="/" /> : <SignUp callback={signup} />}
        </Route>
        <Route path="/">
          {user ? <Posts {...user} /> : <Login callback={login} />}
        </Route>
      </Switch>
      <Snackbar
        message={message}
        open={snackBarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackBarOpen(false)}
      />
    </div>

  );
}

export default Authenticated;
export type { User };