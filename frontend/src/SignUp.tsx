import React, { useState } from 'react';
import {Redirect} from 'react-router-dom';
import {TextField, Button, InputAdornment} from '@material-ui/core';
import {AccountCircle} from '@material-ui/icons';

const SignUp = () => {
    return (
        <div className="Fields">
            <h1>Sign Up</h1><br/>
            <TextField label="First Name" variant="outlined" inputProps={{style: {textAlign: 'center'}}} className="Field"/><br/><br/>
            <TextField label="Last Name" variant="outlined" inputProps={{style: {textAlign: 'center'}}} className="Field"/><br/><br/>
            <TextField label="Username" variant="outlined" inputProps={{style: {textAlign: 'center'}}} className="Field"/><br/><br/>
            <TextField label="Password" variant="outlined" inputProps={{style: {textAlign: 'center'}}} className="Field"/><br/><br/>
            <TextField label="Confirm Password" variant="outlined" inputProps={{style: {textAlign: 'center'}}} className="Field"/><br/><br/>
            <Button variant="contained"  className="LoginButton" href="/home" color="primary">Sign Up</Button><br/>
        </div> 
        );
}

export default SignUp;