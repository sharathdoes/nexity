import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import "./leftbar.css";
import image from "../Images/Profile.png";
import image1 from "../Images/image1.jpg";
import image2 from "../Images/image2.jpg"
import image3 from "../Images/image3.jpg";
import image4 from "../Images/image4.jpg"
import image5 from "../Images/image5.jpg";
import image6 from "../Images/image6.jpg";

export default function Leftbar() {
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const navigateToMentorship = () => {
    navigate('/mentorship'); // Navigate to /mentorship
  };

  return (
    <div className='Leftbar'>
      <div className='NotificationsContainer'>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <p style={{ marginLeft: "-14px" }}>Notifications</p>
          <p style={{ color: "#aaa", marginLeft: "40px" }}>See all</p>
        </div>
        
        {/* Fixed the image source usage */}
        <div style={{ display: 'flex', alignItems: "center", marginTop: -10 }}>
          <img src={image} className="notificationimg" alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start" }}>
            Madan liked your post
          </p>
          <img src={image1} className="likeimage" alt="" />
        </div>
        
        <div style={{ display: 'flex', alignItems: "center", marginTop: -10 }}>
          <img src={image} className="notificationimg" alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, textAlign: "start", width: "120px" }}>
            Suman started following you
          </p>
          <img src={image2} className="followinguserimage" alt="" />
        </div>

        <div style={{ display: 'flex', alignItems: "center", marginTop: -10 }}>
          <img src={image2} className="notificationimg" alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start" }}>
            Madan liked your post
          </p>
          <img src={image3} className="likeimage" alt="" />
        </div>

        <div style={{ display: 'flex', alignItems: "center", marginTop: -10 }}>
          <img src={image} className="notificationimg" alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start" }}>
            Suman started following you
          </p>
          <img src={image4} className="followinguserimage" alt="" />
        </div>

        <div style={{ display: 'flex', alignItems: "center", marginTop: -10 }}>
          <img src={image6} className="notificationimg" alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start" }}>
            Suman started following you
          </p>
          <img src={image5} className="followinguserimage" alt="" />
        </div>

        <div style={{ display: 'flex', alignItems: "center", marginTop: -10 }}>
          <img src={image3} className="notificationimg" alt="" />
          <p style={{ marginLeft: "5px", color: "#aaa", fontSize: 13, width: "120px", textAlign: "start" }}>
            Madan liked your post
          </p>
          <img src={image6} className="likeimage" alt="" />
        </div>
      </div>

      <div className='NotificationsContainer'>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <p style={{ marginLeft: "-20px" }}>Explore</p>
          <p style={{ color: "#aaa", marginLeft: "40px" }}>See all</p>
        </div>
        <div>
          {/* Post images section if required */}
          <button onClick={navigateToMentorship} className="mentorship-button">
            Go to Mentorship
          </button>
        </div>
      </div>
    </div>
  );
}
