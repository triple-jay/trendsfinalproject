import React, { useState } from 'react';
import {Redirect} from 'react-router-dom';
import {TextField, Button, InputAdornment} from '@material-ui/core';
import {AccountCircle} from '@material-ui/icons';
import './Login.css';

type LoginProps = {
    callback: () => void;
}

const Login = ({callback}: LoginProps) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
    <div className="Fields">
        <h1>CUBlogs</h1><br/>
        <TextField label="Username" variant="outlined" inputProps={{style: {textAlign: 'center'}}} className="Field"/><br/><br/>
        <TextField label="Password" variant="outlined" inputProps={{style: {textAlign: 'center'}}} className="Field"/><br/><br/>
        <Button variant="contained"  className="LoginButton" onClick={() => callback()} href="/home" color="primary">Login</Button><br/>
        <Button color="primary" href="/signup">Sign up if you don't have an account!</Button>
    </div> 
    );
}

export default Login;