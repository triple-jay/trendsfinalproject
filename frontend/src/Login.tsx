import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { TextField, Button, InputAdornment } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import './Login.css';

type LoginProps = {
    callback: (email: string, password: string) => void;
}

const Login = ({ callback }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(event.target.value);
    }
    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(event.target.value);
    }

    return (
        <div className="Fields">
            <h1>CUBlogs</h1><br />
            <TextField
                label="Email"
                value={email}
                onChange={onChangeEmail}
                variant="outlined"
                inputProps={{ style: { textAlign: 'center' } }}
                className="Field" />
            <br /><br />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={onChangePassword}
                variant="outlined"
                inputProps={{ style: { textAlign: 'center' } }}
                className="Field" />
            <br /><br />
            <Button
                variant="contained"
                className="LoginButton"
                onClick={() => callback(email, password)}
                color="primary"
            >
                Login
            </Button>
            <br />
            <Button color="primary" href="/signup">Sign up if you don't have an account!</Button>
        </div>
    );
}

export default Login;