import './App.css';
import { React, useState } from 'react'
import Login from './Components/Login/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChangePassword from './Components/Change Password/ChangePassword';
import CreateUser from './Components/CreateUser/CreateUser';
import Feedback from './Components/Feedback/Feedback';
import Profile from './Components/Profile/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import Timesheet from './Components/Timesheet/Timesheet';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/changepassword" element={<ChangePassword />}/>
      <Route path="/create-user" element={<CreateUser />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/timesheet" element={<Timesheet />} />
      <Route path="/profile" element={<Profile />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
