import React, { useState } from 'react';
import { useAuth0, User } from "@auth0/auth0-react";
import './FormInput.css';
import GoogleImage from '../../assets/google.png';
import { FormInputProps } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { changeEvent } from '../../../constants';
import { auth } from '../../firebase-config';



const FormInput: React.FC<FormInputProps> = ({ isLogin }) => {
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();
    const [userDetails, setuserDetails] = useState<{ email: string, password: string }>({
        email: '',
        password: ''
    });
    const [user, setUser] = useState<any>(undefined);

    const handleUsername = (e: changeEvent) => {
        const value: string = e.target.value;
        setuserDetails({ ...userDetails, email: value })
    }

    const handlePassword = (e: changeEvent) => {
        const value: string = e.target.value;
        setuserDetails({ ...userDetails, password: value })
    }

    const handleSubmit = () => {

        if (!isLogin) {
            if (userDetails.email === '' || userDetails.password === '') {
                console.log("User creds not entered.")
                return;
            }
            createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
                .then((userCredential) => {
                    // Signed up 
                    const user = userCredential.user;
                    setUser(user)
                    navigate('/')
                    // ...
                })
                .catch((error) => {
                    console.log(error)
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // ..
                });
        } else {
            signInWithEmailAndPassword(auth, userDetails.email, userDetails.password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    localStorage.setItem('loggedIn', JSON.stringify(true));
                    navigate('/play')
                    // ...
                })
                .catch((error) => {
                    console.log(error)
                    const errorCode = error.code;
                    const errorMessage = error.message;
                });
        }
    }
    return (
        <div className='login-form__container'>
            <div className='login-form__strip'></div>
            <h2>Welcome, User!</h2>
            <p>{isLogin ? "Please log in" : "Please Sign Up"}</p>
            <div className='login-form'>
                <div className='form-div'>
                    <input placeholder='username' className='form-input' type='text' onChange={(e) => { handleUsername(e) }} value={userDetails.email} />
                    <input placeholder='password' className='form-input' type='text' onChange={(e) => { handlePassword(e) }} value={userDetails.password} />
                    <button className='logIn__btn' onClick={handleSubmit}>{isLogin ? "Log In" : "Sign Up"}</button>
                    {isLogin && <button className='logIn__btn signup' onClick={() => { navigate('/register') }}>Sign Up</button>}

                    {/*Auth options*/}
                    <div className='bottom__strip'></div>
                    {isLogin && <button onClick={() => loginWithRedirect()} className='authlogIn__btn'>
                        <img src={GoogleImage} style={{ height: '30px', borderRadius: '20px' }} />
                    </button>}
                </div>
            </div>
        </div>
    )
}

export default FormInput