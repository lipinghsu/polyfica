// Footer.js

import React, { useState } from 'react';
import './Footer.scss';
import { firestore } from '../../firebase/utils';
import { LuArrowRight } from 'react-icons/lu';
import Button from '../forms/Button';
const handlePhoneClick = () => {
  window.open(`facetime://8057561111`);
};

const Footer = () => {
  const [showPopoutBox, setShowPopoutBox] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const popoutBoxDivClass = showPopoutBox ? 'popout-box active' : 'popout-box'
  const popoutModalDivClass = showPopoutBox ? 'popout-box-modal active' : 'popout-box-modal'

  const togglePopoutBox = () => {
    setShowPopoutBox(!showPopoutBox);
  };

  const fetchUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
  };

  const submitFeedback = async (userIP, locationData) => {
    const feedbackData = {
      feedback: feedback,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer,
      userIP: userIP || 'IP not available',
      timestamp: new Date().toISOString(),
      location: locationData ? locationData : 'Location not provided',
    };
  
    try {
      const feedbackRef = await firestore.collection('feedback').add(feedbackData);
      await feedbackRef.update({ feedbackID: feedbackRef.id });
      setFeedbackSubmitted(true);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };
  
  const handleFeedbackSubmit = async (event) => {
    event.preventDefault();
  
    // Collect browser information (User Agent)
    const userAgent = navigator.userAgent;
  
    // Get user timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
    // Get referrer URL (the previous page)
    const referrer = document.referrer;
  
    // Get user IP address from server-side
    const userIP = await fetchUserIP();
  
    // Prepare geolocation data
    let locationData = {};
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          locationData = { latitude, longitude };
  
          // After getting geolocation, proceed to submit the feedback
          submitFeedback(userIP, locationData);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // If geolocation fails, proceed with the form submission without it
          submitFeedback(userIP, null);
        }
      );
    } else {
      // If geolocation is not available, proceed with the form submission
      submitFeedback(userIP, null);
    }
  };
  

  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-column">
          <div className="column-title">
            Contact info
            {/* {temp} */}
          </div>
          <ul>
            <h2 className='phone-number contact-info'><a href="#" onClick={handlePhoneClick}>(805) 756-1111</a></h2>
            <h2 className='contact-info'><a href="https://www.calpoly.edu/">
              <span className="yellow-text">CAL</span>IFORNIA<br></br><span className="yellow-text">POLY</span>TECHNIC <br></br>STATE UNIVERSITY</a></h2>
              
            <h2 className='contact-info'>
              <a href="https://www.google.com/maps/dir//California+Polytechnic+State+University,+1+Grand+Ave,+San+Luis+Obispo,+CA+93407/data=!4m7!4m6!1m1!4e2!1m2!1m1!1s0x80ecf1b4054c3551:0x98b3b48a29d99103!3e0?sa=X&ved=2ahUKEwj-wP-484-EAxWjKkQIHSS_C90Q-A96BAggEAA">1 GRAND AVENUE <br></br><span className="yellow-text">SAN LUIS OBISPO</span>, CA 93407</a>
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
          <h4 className="column-title">Give Feedback</h4>
          <form onSubmit={handleFeedbackSubmit} className='feedback-form'>
            <textarea
              className="feedback-textarea"
              placeholder={ feedbackSubmitted ? "THANKS FOR THE FEEDBACK!" : "TELL US WHAT YOU THINK!"}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            {/* <div onClick={handleSearchClick} className={`arrow-button ${searchTerm ? 'active' : ''}`}> */}
            <Button 
              className='submit-button' 
              onClick={handleFeedbackSubmit}
              type="submit"
            >
              <LuArrowRight className='arrow-icon' />
            </Button>
            {/* {feedbackSubmitted && <p className="success-message">Thank you for your feedback!</p>} */}
          </form>
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
        <div className='text-container'>
          <p className='copy-right'>&copy; 2024 Cal Poly SLO</p>
          {/* <p className='lbd'>Learn By Doing</p> */}
        </div>

        
      </div>
    </footer>
  );
};

export default Footer;

