import React from 'react';
import "./navbar.css";
import searchIcon from "../Images/search.png";
import Notifications from "../Images/bell.png";
import Message from "../Images/message.png";
import Profileimage from "../Images/Profile.png";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../ReduxContainer/userReducer';

export default function Navbar() {
  const userDetails = useSelector((state) => state.user);
  const user = userDetails?.user;
  const id = user?.other?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className='mainNavbar'>
      <div className='LogoContainer'>
        <p>Social</p>
      </div>
      <div>
        <div className='searchInputContainer'>
          <img src={`${searchIcon}`} className="searchIcon" alt="" />
          <input type="text" className='searchInput' placeholder='search your friends' />
        </div>
      </div>
      <div className='IconsContainer'>
        <img src={`${Notifications}`} className="Icons" alt="" />
        <img src={`${Message}`} className="Icons" alt="" />
        <Link to={`/Profile/${id}`}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={`${user?.other?.profile}`} className="ProfileImage" alt="" />
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
