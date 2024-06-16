import React from 'react';
import Directory from '../../components/Directory';
import TopReviews from '../../components/TopReviews';

import './styles.scss';

const Homepage = props => {
    return(
        <section className='homepage'>
            <Directory />
            <TopReviews/>
        </section>
    );
};

export default Homepage;