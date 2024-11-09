import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useSelector, useDispatch } from 'react-redux';
import "./login.css";
import { login } from '../../Component/ReduxContainer/apiCall';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const { isFetching, error } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClick = (e) => {
    e.preventDefault();
    
    login(dispatch, { email, password }).then(() => {
      // Navigate to the home page after a successful login
      console.log("hiin login")
      navigate('/');
    }).catch((err) => {
      console.error("Login error", err);
    });
  };

  return (
    <div className='mainContainerForsignup'>
      <div className='submainContainer'>
        <div style={{ flex: 1, marginLeft: 150, marginBottom: "170px" }}>
          <p className='logoText'>Soc<span className='part'>ial</span></p>
          <p className='introtext'>Connect with your <span className='part'>family and friends </span></p>
        </div>
        <div style={{ flex: 3 }}>
          <p className='createaccountTxt'>Login Account</p>
          <input
            type="email"
            id="email"
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            className='inputText'
          />
          <input
            type="password"
            placeholder='******'
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            className='inputText'
          />
          <button className='btnforsignup' onClick={handleClick}>Login</button>
          <Link to={"/forgot/password"}>
            <p style={{ textAlign: 'start', marginLeft: "30.6%" }}>Forgot password</p>
          </Link>
          <Link to={"/signup"}>
            <p style={{ textAlign: 'start', marginLeft: "30.6%" }}>Create New Account</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
