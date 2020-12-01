import React, { useEffect, useState } from 'react';
import Posts from './Posts';
import Login from './Login';
import SignUp from './SignUp';
import {Switch, Route, Redirect} from 'react-router-dom';



function App() {

  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    setLoggedIn(true)
  }

  return (<div>
    <Switch>
      <Route path="/home">
        <Posts/>
      </Route>
      <Route path="/signup">
        <SignUp/>
      </Route>
      <Route path="/">
        <Login callback={login}/>
      </Route>
    </Switch>
  </div>);
}

export default App;
