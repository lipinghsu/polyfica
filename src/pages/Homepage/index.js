import { useRef } from "react";
import React from 'react';
import Directory from '../../components/Directory';
import TopReviews from '../../components/TopReviews';
import SiteStats from '../../components/SiteStats';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import About from '../../pages/About';
import './styles.scss';

// import useScrollSnap from "react-use-scroll-snap";

const Homepage = ({ showSignupDropdown, setShowSignupDropdown }) => {
    const scrollRef = useRef(null);
    // useScrollSnap({ ref: scrollRef, duration: 320, delay: 0});
    return (
        <section className='homepage' >
            {/* <div className="snap-section"> */}
            {/* <Header 
                // {...props} 
                showSignupDropdown={showSignupDropdown} 
                setShowSignupDropdown={setShowSignupDropdown} 
                homepageHeader = {true}
            /> */}
                <Directory showSignupDropdown={showSignupDropdown} />
            {/* </div> */}
            {/* <About /> */}
            {/* <div className="snap-section"> */}
                <TopReviews />
                {/* <Footer /> */}
            {/* </div> */}
            <div className="footer-section">
            {/* <TopReviews /> */}
                <Footer />
            </div>
        </section>
    );
};

export default Homepage;
