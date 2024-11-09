import React, { useEffect, useState } from 'react';
import "./profileleftbar.css";
import image from "../Images/Profile.png";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

export default function ProfileLeftbar() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const userDetails = useSelector((state) => state.user);
  const user = userDetails.user;
  const accessToken = user?.accessToken;
  const [users, setUser] = useState({});
  const [followStatus, setFollowStatus] = useState(user.other.Following.includes(id) ? "Unfollow" : "Follow");

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/post/user/details/${id}`);
        setUser(res.data);
      } catch (error) {
        console.log("Error fetching user details");
      }
    };
    getUser();
  }, [id]);

  const handleFollow = async () => {
    try {
      await fetch(`http://localhost:3000/api/user/following/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': "application/JSON",
          token: accessToken
        },
        body: JSON.stringify({ user: `${user.other._id}` })
      });
      setFollowStatus(followStatus === "Follow" ? "Unfollow" : "Follow");
    } catch (error) {
      console.log("Error updating follow status");
    }
  };

  return (
    <div className='ProfileLeftbar'>
      <div className='NotificationsContainer'>
        <img src={`${image}`} className="ProfilepageCover" alt="Profile Cover" />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: -30 }}>
          <img src={`${users.profile}`} className="Profilepageimage" alt="User Profile" />
          <div>
            <p style={{ marginLeft: 6, marginTop: 20, color: "black", textAlign: 'start' }}>{users.username}</p>
            <p style={{ marginLeft: 6, color: "black", textAlign: "start", marginTop: -16, fontSize: 11 }}>Software Developer</p>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ color: "black", marginLeft: 20, fontSize: "14px" }}>Following</p>
          <p style={{ color: "black", marginRight: 20, fontSize: "12px", marginTop: 17 }}>{users?.Following?.length}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -20 }}>
          <p style={{ color: "black", marginLeft: 20, fontSize: "14px" }}>Followers</p>
          <p style={{ color: "black", marginRight: 20, fontSize: "12px", marginTop: 17 }}>{users?.Followers?.length}</p>
        </div>
        <div style={{ marginTop: -20 }}>
          <h5 style={{ color: "black", marginLeft: 10, fontSize: "14px", textAlign: "start" }}>User bio</h5>
          <p style={{ color: "black", fontSize: "12px", marginTop: -20, textAlign: "start", marginLeft: "10px" }}>
            {users.bio || "I would rather be despised for who I am, rather than loved for who I am not."}
          </p>
        </div>
        {user.other._id !== id ? (
          <button onClick={handleFollow} style={{ width: "100%", padding: "7px", border: "none", backgroundColor: "green", color: "white" }}>
            {followStatus}
          </button>
        ) : (
          <button style={{ width: "100%", padding: "7px", border: "none", backgroundColor: "green", color: "white" }}>
            Edit Bio
          </button>
        )}
      </div>
    </div>
  );
}
