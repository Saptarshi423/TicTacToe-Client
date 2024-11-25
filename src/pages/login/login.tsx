import React from 'react';
import './login.css'
import FormInput from '../../components/FormInput/FormInput';

const Login = () => {

  return (
    <div className='login-page'>
      <FormInput isLogin={true}/>
    </div>
  )
}

export default Login