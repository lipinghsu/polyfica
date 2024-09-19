import React from 'react';
import Directory from '../../components/Directory';
import TopReviews from '../../components/TopReviews';
import SiteStats from '../../components/SiteStats';

import './styles.scss';

const Homepage = ({ showSignupDropdown }) => {
    return (
        <section className='homepage'>
            <Directory showSignupDropdown={showSignupDropdown} />
            {/* <SiteStats /> */}
            <TopReviews />
        </section>
    );
};

export default Homepage;
