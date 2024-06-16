// Directory.js

import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import polyRatingsText from './../../assets/poly_ratings_text.png';
import { LuSearch } from 'react-icons/lu';

import './styles.scss';

const Directory = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter' && searchTerm.length > 0) {
      history.push(`/search/professors?term=${searchTerm}`);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.length > 0) {
      history.push(`/search/professors?term=${searchTerm}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='directory'>
      <div className='wrap'>
        <div className='item'>
          <div className='inner-wrap'>
            {/* Move polyRatingsText above the search bar */}
            <div className='polyRatings-text'>
              <img src={polyRatingsText} alt='polyRatingsText' />
            </div>

            {/* Add the search bar here */}
            <div className='search-bar'>
              <div className='search-input'>
              <LuSearch onClick={handleSearchClick} className='lu-search-icon'/>
                <input 
                type='text' 
                value={searchTerm}
                onKeyPress={handleSearchEnter}
                placeholder='Search for a professor' 
                onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* Add any search button or icon here if needed */}
            </div>
            {/* Rest of your inner-wrap content */}
            <a>
              <div className='item-logo'></div>
            </a>
            {/* ::after pseudo-element */}
            <div className='overlay'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory;