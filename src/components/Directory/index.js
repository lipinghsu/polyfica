import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import polyRatingsText from './../../assets/poly_ratings_text.png';
import { LuSearch } from 'react-icons/lu';
import './styles.scss';

const Directory = ({ showSignupDropdown }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false); // State to manage z-index
  const searchBarRef = useRef(null);
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

  const handleFocus = () => {
    setIsSearchFocused(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
    };

    if (isSearchFocused) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchFocused]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='directory'>
      <div className='wrap'>
        <div
          className='item'
          style={{ zIndex: isSearchFocused ? 1 : showSignupDropdown ? -1 : 0 }} // Apply z-index dynamically
        >
          <div className='inner-wrap'>
            <div className='polyRatings-text'>
              <img src={polyRatingsText} alt='polyRatingsText' />
            </div>
            <div className='search-bar' ref={searchBarRef}>
              <div className='search-input'>
                <LuSearch onClick={handleSearchClick} className='lu-search-icon' />
                <input
                  type='text'
                  value={searchTerm}
                  onKeyPress={handleSearchEnter}
                  placeholder='Search for a professor'
                  onFocus={handleFocus}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <a>
              <div className='item-logo'></div>
            </a>
            <div className='overlay'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Directory;
