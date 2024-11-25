
import './App.css';
import PlayPage from './pages/play/play';
import LoginPage from './pages/login/login';
import RegisterPage from './pages/register/register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import ProtectedRoute from './protectedRoute';

function getValue(val:any){
  if(val === 'true') return true;
  if(val === 'false') return false;
}

function App() {
  const { user, isAuthenticated } = useAuth0();
  const [loggedIn, setLoggedIn] = useState(getValue(localStorage.getItem("loggedIn")))


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/play' element={<ProtectedRoute isAuthenticated={isAuthenticated} loggedIn={loggedIn}><PlayPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
