import React from 'react';
import "./navbar.css";
import searchIcon from "../Images/search.png";
import Notifications from "../Images/bell.png";
import Message from "../Images/message.png";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../ReduxContainer/userReducer';
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails?.user;
  console.log(user);
  let id = user?.other?._id;
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className='mainNavbar'>
      <div className='LogoContainer'>
        <p>Nexity</p>
      </div>
      <div>
        <div className='searchInputContainer'>
          <img src={`${searchIcon}`} className="searchIcon" alt="" />
          <input type="text" className='searchInput' placeholder='search your friends' />
        </div>
      </div>
      <div className='IconsContainer'>
        <img src={`${Notifications}`} className="Icons" alt="" />
        
        {/* Use <a> for external link */}
        <a href="http://localhost:5173/chat">
          <img src={`${Message}`} className="Icons" alt="Chat" />
        </a>

        <Link to={`/Profile/${id}`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user?.other?.profile ? (
              <img 
                src={`${user?.other?.profile}`} 
                className="ProfileImage" 
                alt="Profile" 
              />
            ) : (
              <FaUserCircle size={30} style={{ color: 'black' }} />
            )}
            <p style={{ marginLeft: '5px' }}>{user?.other?.username}</p>
          </div>
        </Link>
        
        <div style={{ marginRight: "30px", marginLeft: "20px", cursor: "pointer" }} onClick={handleLogout}>
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
}
