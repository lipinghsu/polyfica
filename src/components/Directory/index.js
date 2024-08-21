import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import polyRatingsText from './../../assets/poly_ratings_text.png';
import { LuSearch, LuX, LuArrowRight } from 'react-icons/lu';
import { firestore } from '../../firebase/utils';
import './styles.scss';

const Directory = ({ showSignupDropdown }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false); 
  const [suggestions, setSuggestions] = useState([]);
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

  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
  };

  const handleFocus = () => {
    setIsSearchFocused(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsSearchFocused(false);
        setSuggestions([]);
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
    const fetchSuggestions = async () => {
      try {
        if (!searchTerm) {
          setSuggestions([]);
          return;
        }

        const professorsRef = firestore.collection("professors");
        let suggestions = [];
        const searchTerms = searchTerm.toLowerCase().split(" ");

        const allProfessorsSnapshot = await professorsRef.get();
        let allProfessors = [];
        allProfessorsSnapshot.forEach((doc) => allProfessors.push({ id: doc.id, ...doc.data() }));

        suggestions = allProfessors.filter(professor =>
          searchTerms.some(term =>
            professor.firstName.toLowerCase().includes(term) ||
            professor.lastName.toLowerCase().includes(term)
          )
        );

        suggestions = suggestions.slice(0, 5);
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    if (searchTerm) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  return (
    <div className='directory'>
      <div className='wrap'>
        <div
          className='item'
          style={{ zIndex: isSearchFocused ? 1 : showSignupDropdown ? -1 : 0 }}
        >
          <div className='inner-wrap'>
            <div className='polyRatings-text'>
              <img src={polyRatingsText} alt='polyRatingsText' />
            </div>
            <div 
              className={`search-bar ${isSearchFocused ? 'active' : ''}`} 
              ref={searchBarRef}
            >
              <div className={`search-input ${suggestions.length > 0 ? 'active' : ''}`} >
                <LuSearch className='lu-search-icon' />
                <input
                  type='text'
                  value={searchTerm}
                  onKeyPress={handleSearchEnter}
                  placeholder='Search for a professor'
                  onFocus={handleFocus}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <>
                    <div onClick={handleClearSearch} className='clear-button'>
                      CLEAR
                    </div>
                    <div onClick={handleClearSearch} className='arrow-button'>
                      <LuArrowRight onClick={handleSearchClick} className='arrow-icon' />
                    </div>
                  </>
                )}
                
              </div>
              {suggestions.length > 0 && (
                <div className='suggestions'>
                  {suggestions.map((professor, index) => (
                    <div key={index} className='suggestion-item'>
                      {professor.firstName} {professor.lastName}
                    </div>
                  ))}
                </div>
              )}
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
