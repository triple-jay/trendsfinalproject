import React, { useState } from 'react';
import 'firebase/auth';
import firebase from 'firebase/app';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import { useEffect } from 'react';

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

type Props = {
  children: React.ReactNode;
};

const Authenticated = ({ children }: Props) => {
  const [user, setUser] = useState<firebase.User | null>(null);

  const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  };

  function onAuthStateChange() {
    return firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });
  }

  useEffect(() => onAuthStateChange(), []);

  return (
    <div>
      {user && children}
      {!user && (
        <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      )}
    </div>
  );
};

export default Authenticated;