import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import "./signup.css";
import { signup } from '../../Component/ReduxContainer/apiCall';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const dispatch = useDispatch();
  const {isFetching  , error} = useSelector((state)=>state.user);
  const user = useSelector((state)=>state.user);
  const [email , setEmail] = useState('');
  const [phonenumber , setphonenumber] = useState('');
  const [username , setusername] = useState('');
  const [password , setpassword] = useState('');
  const userDetails = user.user;
  const navigator = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();

    // Proceed with signup without handling file upload
    signup(dispatch, { email, password, username, phonenumber });
  }


  if (userDetails?.Status === 'Pending') {
    navigator("/verify/email");
  }
  

  return (
    <div className='mainContainerForsignup'>
      <div className='submainContainer'>
        <div style={{ flex: 1, marginLeft: 150, marginBottom: "170px" }}>
          <p className='logoText'>Soc<span className='part'>ial</span></p>
          <p className='introtext'>Connect with your <span className='part'>family and friends</span></p>
        </div>
        <div style={{ flex: 3 }}>
          <p className='createaccountTxt'>Create New Account</p>
          {/* Removed the file input */}
          <input type="text" placeholder='Username' onChange={(e) => setusername(e.target.value)} className='inputText' />
          <input type="text" placeholder='Phonenumber' onChange={(e) => setphonenumber(e.target.value)} className='inputText' />
          <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} className='inputText' />
          <input type="password" placeholder='******' onChange={(e) => setpassword(e.target.value)} className='inputText' />
          <button className='btnforsignup' onClick={handleClick}>Signup</button>
          <Link to={"/"}>
            <p style={{ textAlign: 'start', marginLeft: "30.6%" }}>Already have an account</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
