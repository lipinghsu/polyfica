import React, { useState } from 'react';
import Header from './../components/Header';
import Footer from '../components/Footer';
import './styles.scss';

const MainLayout = props =>{
    const [showSignupDropdown, setShowSignupDropdown] = useState(false);
    return(
        <div className='flex-wrapper-main-layout'>
            <Header
                {...props} 
                showSignupDropdown={showSignupDropdown} 
                setShowSignupDropdown={setShowSignupDropdown} 
            />
            <div className="main">
                {props.children}
            </div>
            <Footer />
        </div>
    );
};

export default MainLayout;