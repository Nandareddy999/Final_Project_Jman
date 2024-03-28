import './App.css';
import React from 'react'
import Login from './Components/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChangePassword from './Components/Change Password/ChangePassword';
import CreateUser from './Components/CreateUser/CreateUser';
import Feedback from './Components/Feedback/Feedback';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/changepassword" element={<ChangePassword />}/>
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/feedback" element={<Feedback />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
