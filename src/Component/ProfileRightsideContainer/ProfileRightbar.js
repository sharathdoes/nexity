import React, { useEffect, useState } from 'react';
import "./profilerightbar.css";
import axios from 'axios';
import Follow from '../RightsideContainer/Follow';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

export default function ProfileRightbar() {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user;
  let location = useLocation();
  let id = location.pathname.split("/")[2];
  let idForSuggest = user?.other?._id;

  const [FollowingUser, setFollowingUser] = useState([]);
  const [SuggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/post/following/${id}`);
        setFollowingUser(res.data);
      } catch (error) {
        console.log("Error fetching following users");
      }
    };
    getFollowing();
  }, [id]);

  useEffect(() => {
    const getSuggestedUsers = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/user/all/user/${idForSuggest}`);
        setSuggestedUsers(res.data);
      } catch (error) {
        console.log("Error fetching suggested users");
      }
    };
    getSuggestedUsers();
  }, [idForSuggest]);

  return (
    <div className='Profilerightbar'>
      <div className='profilerightcontainer'>
        <h3>Following</h3>
        <div>
          {FollowingUser.map((item) => (
            <div style={{ marginTop: "10px" }} key={item._id}>
              <div style={{ display: 'flex', alignItems: "center", marginLeft: 10, cursor: "pointer" }}>
                <img src={item.profile} className="Friendsimage" alt="Following" />
                <p style={{ textAlign: "start", marginLeft: "10px" }}>{item.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='rightcontainer2'>
        <h3 style={{ textAlign: "start", marginLeft: "10px" }}>Suggested for you</h3>
        {SuggestedUsers.map((item) => (
          <Follow userdetails={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}
