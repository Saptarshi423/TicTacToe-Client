import React, { useState } from 'react';
import { useAuth0, User } from "@auth0/auth0-react";
import './FormInput.css';
import GoogleImage from '../../assets/google.png';
import { FormInputProps } from '../../../constants';
import { useNavigate } from 'react-router-dom';
import { changeEvent } from '../../../constants';
import { auth } from '../../firebase-config';
import { signIn, logIn } from '../../utils';



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

    const handleSubmit = async ()  => {

        const val: number = isLogin ? 1 : 0; //Login ->1, SignUp->0

        switch (val) {
            case 0:
                let resp: any = await signIn(userDetails.email, userDetails.password, auth);
                if (resp !== undefined) {
                    setUser(resp.user);
                    navigate('/')
                }
                return;
            case 1:
                let resp2: any = await logIn(userDetails.email, userDetails.password, auth);
                if (resp2 !== undefined) {
                    localStorage.setItem('loggedIn', JSON.stringify(true));
                    navigate('/play')
                }
                return;
            default:
                break;

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
                    <input placeholder='password' className='form-input' type='password' onChange={(e) => { handlePassword(e) }} value={userDetails.password} />
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