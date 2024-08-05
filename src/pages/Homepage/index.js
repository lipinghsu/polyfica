import React from 'react';
import Directory from '../../components/Directory';
import TopReviews from '../../components/TopReviews';

import './styles.scss';

const Homepage = ({ showSignupDropdown }) => {
    return (
        <section className='homepage'>
            <Directory showSignupDropdown={showSignupDropdown} />
            <TopReviews />
        </section>
    );
};

export default Homepage;
