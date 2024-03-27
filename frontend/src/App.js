import './App.css';
import React from 'react'
import Login from './Components/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChangePassword from './Components/Change Password/ChangePassword';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/changepassword" element={<ChangePassword />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
