// Footer.js

import React, { useState } from 'react';
import './Footer.scss';

const handlePhoneClick = () => {
  window.open('facetime://' + '8057561111');
};

const Footer = () => {
  const [showPopoutBox, setShowPopoutBox] = useState(false);

  const togglePopoutBox = () => {
    setShowPopoutBox(!showPopoutBox);
  };
  const popoutBoxDivClass = showPopoutBox ? 'popout-box active' : 'popout-box'
  const popoutModalDivClass = showPopoutBox ? 'popout-box-modal active' : 'popout-box-modal'
  return (
    <footer className="site-footer">
  
  <div className="footer-container">
        <div className="footer-column">
          <div className="column-title">
            Contact Info
          </div>
          <ul>
            <h2 className='phone-number contact-info'><a href="#" onClick={handlePhoneClick}>(805) 756-1111</a></h2>
            <h2 className='contact-info'><a href="https://www.calpoly.edu/">
              <span className="green-text">CAL</span>IFORNIA<br></br><span className="green-text">POLY</span>TECHNIC <br></br>STATE UNIVERSITY</a></h2>
            <h2 className='contact-info'>
              <a href="https://www.google.com/maps/dir//California+Polytechnic+State+University,+1+Grand+Ave,+San+Luis+Obispo,+CA+93407/data=!4m7!4m6!1m1!4e2!1m2!1m1!1s0x80ecf1b4054c3551:0x98b3b48a29d99103!3e0?sa=X&ved=2ahUKEwj-wP-484-EAxWjKkQIHSS_C90Q-A96BAggEAA">1 GRAND AVENUE <br></br><span className="green-text">S</span>AN <span className="green-text">L</span>UIS <span className="green-text">O</span>BISPO, CA 93407</a>
          </h2>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="column-title">Campus Links</h4>
          <ul>
            <h2 className='quick-links'><a href="https://maps.calpoly.edu/">CAL POLY MAPS</a></h2>
            <h2 className='quick-links'><a href="https://mustangnews.net/">MUSTANG NEWS</a></h2>
            <h2 className='quick-links'><a href="https://myportal.calpoly.edu/">CAL POLY PORTAL</a></h2>
            <h2 className='quick-links'><a href="https://www.calpoly.edu/">UNIVERSITY HOME</a></h2>
            <h2 className='quick-links'><a href="https://magazine.calpoly.edu/">CAL POLY MAGAZINE</a></h2>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="column-title">More</h4>
          <ul>
            <h2 className='more'><a href="#">_</a></h2>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
      <div className="bottom-top-wrap">
        <div className={popoutBoxDivClass} onClick={togglePopoutBox}>
          <p>{showPopoutBox ? "CLOSE" : "HELP"}</p>
        </div>
        {showPopoutBox && (
          <div className={popoutModalDivClass}>
            <p>This is the help modal content.</p>
          </div>
        )}
        <div className="polySeal-container">
          <div className="polySeal-image"/>
        </div>
      </div>

        {/* <p>Learn by Doing<sup><small>SM</small></sup></p> */}
        <p>&copy; Cal Poly SLO 2024 </p>
      </div>
    </footer>
  );
};

export default Footer;

