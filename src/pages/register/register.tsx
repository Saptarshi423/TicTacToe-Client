import React from 'react';
import './register.css';
import FormInput from '../../components/FormInput/FormInput';

const register = () => {
  return (
    <div className='register-page'>
      <FormInput isLogin={false}/>
    </div>
  )
}

export default register