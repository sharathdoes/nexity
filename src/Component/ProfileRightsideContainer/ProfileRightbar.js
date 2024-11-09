import React, { useEffect, useState } from 'react'
import "./profilerightbar.css"
import axios from 'axios';
import Follow from '../RightsideContainer/Follow';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
export default function ProfileRightbar() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails.user
  let location = useLocation();
  let id = location.pathname.split("/")[2];
  let idforSuggest = user?.other?._id
  const [Followinguser , setFollowinguser] = useState([]);
  useEffect(() => {
    const getFollowing = async()=>{
      try {
        const res = await axios.get(`http://localhost:3001/api/post/followers/${id}`);
        setFollowinguser(res.data);
      } catch (error) {
        console.log("Error")
      }
    }
    getFollowing();
  }, [])

  console.log(Followinguser)

  const [users , setUsers] = useState([]);
  useEffect(() => {
    const getuser = async () => {
      try {
        console.log(user.other, "lanj");
        const res = await axios.post(
          `http://127.0.0.1:5000/accomplices`,
          user.other,
          {
            headers: {
              'Content-Type': 'application/json',  // Explicitly set content type to JSON
            },
          }
        );
        console.log(res.data, "py");
        setUsers(res.data.recommended_accomplices);
      } catch (error) {
        console.error("Error occurred:", error.response ? error.response.data : error.message);
      }
    };
    
    getuser();
  }, [])
  console.log(users,"lik")
  
  return (
    <div className='Profilerightbar'>
      <div className='profilerightcontainer'>
        <h3>Followers</h3>
        <div>
          {Followinguser.map((item)=>(
            <div style={{marginTop:"10px"}}>
             <div style={{display:'flex' , alignItems:"center" , marginLeft:10 , cursor:"pointer"}}>
              <img src={`${item.profile}`} className="Friendsimage" alt="" />
              <p style={{textAlign:"start"  , marginLeft:"10px"}}>{item.username} </p>
            </div>
          </div>
            ))}
          
          
          
        </div>

      </div>

      <div className='rightcontainer2'>
        <h3 style={{textAlign:"start" , marginLeft:"10px"}}>Suggested for you</h3>
        {users.map((item, ind)=>(
          <Follow userdetails={item} key={ind} git={item}/>
          ))}
        
      </div>


    </div>
  )
}
