import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles.scss';

const HomepageLayout = (props) => {
    const [showSignupDropdown, setShowSignupDropdown] = useState(false);

    return (
        <div className='flex-wrapper-homepage-layout'>
            <Header 
                {...props} 
                showSignupDropdown={showSignupDropdown} 
                setShowSignupDropdown={setShowSignupDropdown} 
            />
            {React.cloneElement(props.children, { showSignupDropdown })}
            <Footer />
        </div>
    );
};

export default HomepageLayout;