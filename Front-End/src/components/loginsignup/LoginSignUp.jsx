import React, {useState} from 'react'
import './LoginSignUp.css'

import user_icon from '../assets/user.svg'
import email_icon from '../assets/email.svg'
import password_icon from '../assets/password.svg'
import logo from '../assets/horizontallogo.png'


const LoginSignUp = () => {
    const ImageSize ={ width : '25px' , height : '25px' };
    const ImageSize1={width : '400px', height : '100px' };
    const ImageSize2={width : '600px', height : '500px' };
    const [action,setAction]=useState("Login");

  return (
       <div className="page-container">
            <div className="logo-container">
                <img style={ImageSize1} src={logo} alt="" />
            </div>

           <div className="design-container">
               <svg width="600" height="300" viewBox="0 0 667 377" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M192.363 334.096C111.389 419.496 -29.3599 336.773 5.85602 224.481C12.4199 203.551 12.6182 181.081 6.46104 160.028C-27.1815 44.9942 116.087 -38.5843 198.723 48.225L477.987 341.592C562.256 430.116 705.735 333.689 656.971 221.618C646.15 196.749 645.204 168.619 654.378 143.097C693.348 34.6899 556.283 -49.7124 477.02 33.8821L192.363 334.096Z" fill="url(#paint0_linear_116_2)"/>
<defs>
<linearGradient id="paint0_linear_116_2" x1="-189.925" y1="547.755" x2="-208.429" y2="-661.822" gradientUnits="userSpaceOnUse">
<stop stop-color="#00AFF0"/>
<stop offset="1" stop-color="#00AFF0" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>

           </div>

    <div className='container'>
        <div className="header">
            <div className="text">{action}</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            {action === "Login" ?<div></div>: <div className="input">
                <img style={ImageSize} src={user_icon} alt="" />
                <input type="text" placeholder="Name" />
            </div>}


            <div className="input">
                <img style={ImageSize} src={email_icon} alt="" />
                <input type="email" placeholder="Email"  />
            </div>
            <div className="input">
                <img style={ImageSize} src={password_icon} alt="" />
                <input type="password" placeholder="Password" />
            </div>
        </div>
        {action === "Sign Up"?<div></div>: <div className="forgot-password">Lost password? <span>Click Here!</span></div>}

       <div className="submit-container">
           <div className={`submit ${action === "Sign Up" ? "" : "gray"}`} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
           <div className={`submit ${action === "Login" ? "" : "gray"}`} onClick={()=>{setAction("Login")}}>Login</div>
       </div>
    </div>

  </div>
  )
}

export default LoginSignUp
