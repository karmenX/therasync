import React, {useState} from 'react'
import './MainPage.css'

import logo1 from '../assets/logo.png'
import calendar from '../assets/calendar.svg'
import chatbox from '../assets/chatbox.svg'
import doctor from '../assets/doctor.svg'
import session from '../assets/session.svg'

const MainPage = () => {
   const ImageSize ={ width : '75px' , height : '75px' };
   const ImageSize1 ={ width : '25px' , height : '25px' };
  return (
    <header>
        <img src={logo1} alt="TheraSync Logo" className="logo" />

      <div className="navbar">

   <div className="nav-links">
  <a href="#"><img style={ImageSize} src={doctor} alt="" /><span>DOCTORS</span></a>
  <a href="#"><img style={ImageSize} src={calendar} alt="" /><span>CALENDAR</span></a>
  <a href="#"><img style={ImageSize} src={session} alt="" /><span>SESSIONS</span></a>
  <a href="#"><img style={ImageSize} src={chatbox} alt="" /><span>CHAT</span></a>
  <a href="#"><i className="fas fa-info-circle"></i><span>     template  </span></a>
</div>


      </div>
          <div className="profile-button">profile</div>
    </header>
  );
};

export default MainPage;
