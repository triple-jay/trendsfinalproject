import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';

type SignUpProps = {
    callback: (email: string, password: string, firstName: string, lastName: string) => void;
}

const SignUp = ({ callback }: SignUpProps) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [message, setMessage] = useState('');
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const onChangeFirstName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFirstName(event.target.value);
    }
    const onChangeLastName = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setLastName(event.target.value);
    }
    const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEmail(event.target.value);
    }
    const onChangePassword = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(event.target.value);
    }
    const onChangePasswordRepeat = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPasswordRepeat(event.target.value);
    }

    const trySignUp = () => {
        if (firstName.length === 0 || lastName.length === 0) {
            setMessage('Please enter your first and last name!');
            setSnackBarOpen(true);
        }
        else if (email.length === 0 || password.length === 0) {
            setMessage('Please enter your email address and password!');
            setSnackBarOpen(true);
        }
        else if (password === passwordRepeat) {
            callback(email, password, firstName, lastName);
        }
    }

    return (
        <div className="Fields">
            <h1>Sign Up</h1>
            <br />
            <TextField
                label="First Name"
                value={firstName}
                onChange={onChangeFirstName}
                variant="outlined"
                inputProps={{ style: { textAlign: 'center' } }}
                className="Field" />
            <br /><br />
            <TextField
                label="Last Name"
                value={lastName}
                onChange={onChangeLastName}
                variant="outlined"
                inputProps={{ style: { textAlign: 'center' } }}
                className="Field" />
            <br /><br />
            <TextField
                label="Email Address"
                value={email}
                onChange={onChangeEmail}
                variant="outlined"
                inputProps={{ style: { textAlign: 'center' } }}
                className="Field" />
            <br /><br />
            <TextField
                label="Password"
                value={password}
                onChange={onChangePassword}
                error={password.length > 0 && password.length < 6}
                helperText={password.length > 0 && password.length < 6 ? "Password must be at least 6 characters" : ""}
                type="password"
                variant="outlined"
                inputProps={{ style: { textAlign: 'center' } }}
                className="Field" />
            <br /><br />
            <TextField
                label="Confirm Password"
                value={passwordRepeat}
                onChange={onChangePasswordRepeat}
                error={password !== passwordRepeat}
                helperText={password !== passwordRepeat ? "Passwords do not match" : ""}
                type="password"
                variant="outlined"
                inputProps={{ style: { textAlign: 'center' } }}
                className="Field" />
            <br /><br />
            <Button
                variant="contained"
                className="LoginButton"
                onClick={trySignUp}
                color="primary"
            >
                Sign Up
            </Button>
            <br />
            <Button color="primary" href="/">Already have an account? Login</Button>
            <Snackbar
                message={message}
                open={snackBarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackBarOpen(false)}
            />
        </div>
    );
}

export default SignUp;