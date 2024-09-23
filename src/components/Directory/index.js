import React, { useState, useEffect, useRef } from 'react';
import { useHistory, Link } from 'react-router-dom';
import polyfica_text from './../../assets/polyfica_text.png';
import { LuSearch, LuArrowRight } from 'react-icons/lu';
import { firestore } from '../../firebase/utils';
import defaultProfileImage from "../../assets/defaultProfImage.png";
import facebookLogo from "../../assets/Facebook_Logo_Secondary.png";
import tiktokLogo from "../../assets/TikTok_Icon_Black_Circle.png";
import instagramLogo from "../../assets/Instagram_Glyph_White.png";
import './styles.scss';


const Directory = ({ showSignupDropdown }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchBarRef = useRef(null);
  const history = useHistory();
  const dynamicTextRef = useRef(null); 
  const cursorRef = useRef(null); 

  // Typing effect phrases
  const phrases = ["Join our community!", 
                  "Share your experience!", 
                  "Make informed decisions!"];

  useEffect(() => {
    let currentPhrase = 0;
    let charIndex = 0;
    let typingTimeout = 0;
    let deletingTimeout = 0;

    const element = dynamicTextRef.current;
    const cursor = cursorRef.current; // Reference the cursor element

    const setDynamicTextWidth = () => {
      if (element) {
        element.style.width = `${element.scrollWidth}px`; // Dynamically set the width based on content
      }
    };

    const typePhrase = () => {
      const currentText = phrases[currentPhrase];
      if (charIndex < currentText.length) {
        element.innerHTML += currentText[charIndex];
        charIndex++;
        setDynamicTextWidth();  // Update width dynamically as characters are added
        cursor.style.opacity = 1;  // Ensure the cursor is visible
        typingTimeout = setTimeout(typePhrase, 100); // Typing speed
      } else {
        // After typing is complete, make the cursor blink
        cursor.style.animation = "blink 1s step-end infinite";
        deletingTimeout = setTimeout(deletePhrase, 2000); // Wait before deleting
      }
    };

    const deletePhrase = () => {
      const currentText = phrases[currentPhrase];
      if (charIndex > 0) {
        element.innerHTML = currentText.substring(0, charIndex - 1);
        charIndex--;
        setDynamicTextWidth();  // Update width dynamically as characters are removed
        cursor.style.opacity = 1;  // Ensure the cursor is visible during delete
        cursor.style.animation = "";  // Stop blinking while deleting
        deletingTimeout = setTimeout(deletePhrase, 100); // Deleting speed
      } 
      else {
        currentPhrase = (currentPhrase + 1) % phrases.length; // Cycle to next phrase
        typingTimeout = setTimeout(typePhrase, 500);
      }
    };

    // Start typing effect
    typePhrase();

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(deletingTimeout);
    };
  }, []);

  const handleSearchEnter = (e) => {
    if (e.key === 'Enter' && searchTerm.length > 0) {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        history.push(`/search/professors/${suggestions[activeSuggestionIndex].profID}`);
      } else {
        history.push(`/search/professors?term=${searchTerm}`);
      }
    } else if (e.key === 'ArrowDown') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length ? prevIndex + 1 : -1
      );
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex > -1 ? prevIndex - 1 : suggestions.length
      );
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.length > 0) {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        history.push(`/search/professors/${suggestions[activeSuggestionIndex].profID}`);
      } else {
        history.push(`/search/professors?term=${searchTerm}`);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setActiveSuggestionIndex(-1);
  };

  const handleFocus = () => {
    setIsSearchFocused(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsSearchFocused(false);
        setSuggestions([]);
        setActiveSuggestionIndex(-1);
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
      } 
      catch (error) {
        setSuggestions([]);
      }
    };

    if (searchTerm) {
      fetchSuggestions();
    } 
    else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const highlightMatch = (text, searchTerm) => {
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <div className='directory'>
      <div className='wrap'>
        <div
          className='item'
          style={{ zIndex: isSearchFocused ? 1 : showSignupDropdown ? -1 : 0 }}
        >
          <div className='inner-wrap'>
            <div className='polyfica_text'>
              <img src={polyfica_text} alt='polyficaText' />
            </div>
            <div className={`search-wrapper ${suggestions.length > 0 ? ' with-shadow' : ''}`}>
              <div className={`search-bar-block ${suggestions.length > 0 ? ' active' : ''}`} />
              <div className={`search-bar ${isSearchFocused ? ' active' : ''} ${suggestions.length > 0 ? ' no-shadow' : ''}`} ref={searchBarRef}>
                <div className={`search-input ${suggestions.length > 0 ? ' active' : ''}`}>
                  <LuSearch className='lu-search-icon' />
                  <input
                    type='text'
                    value={searchTerm}
                    onKeyDown={handleSearchEnter}
                    placeholder='Search for a professor'
                    onFocus={handleFocus}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setActiveSuggestionIndex(-1);
                    }}
                    className={`${suggestions.length > 0 ? 'active' : ''}`}
                  />
                  {searchTerm && (
                    <>
                      <div onClick={handleClearSearch} className='clear-button'>
                        CLEAR
                      </div>

                    </>
                  )}
                  <div onClick={handleSearchClick} className={`arrow-button ${searchTerm ? 'active' : ''}`}>
                    <LuArrowRight className='arrow-icon' />
                  </div>
                </div>
                <div className={`suggestions ${suggestions.length > 0 ? ' active' : ''}`}>
                    {suggestions.map((professor, index) => (
                      <Link
                        to={`/search/professors/${professor.profID}`}
                        key={index}
                        className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                      >
                        <div className='profileImage-wrap'>
                          {professor.profileImage ? (
                          <img src={professor.profileImage} alt={`${professor.firstName} ${professor.lastName}`} />
                          ) : (
                          <img src={defaultProfileImage} alt="Default Profile" />
                          )}
                        </div>

                        <div className='right-wrap'>
                          <div className="professor-name">
                            {highlightMatch(professor.firstName, searchTerm)} {highlightMatch(professor.lastName, searchTerm)}
                          </div>
                          <div className="professor-details">
                            <div className="professor-department">{professor.department}</div>
                            <div className="professor-schoolName">{professor.schoolName}</div>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {/* Add the last suggestion to search for the term */}
                    {suggestions.length > 0 && (
                    <div
                      className={`suggestion-item search-for ${activeSuggestionIndex === suggestions.length ? 'active' : ''}`}
                      onClick={() => history.push(`/search/professors?term=${searchTerm}`)}
                    >
                      <div className='img-wrap'>
                        <LuSearch className='lu-search-icon' />
                      </div >
                      Search for "{searchTerm}"...
                    </div>
                    )}
                  </div>
              </div>
            </div>
            <a>
              <div className='item-logo'></div>
            </a>
            <div className='overlay'></div>
          </div>

          <div className='site-descrpition-wrap'>
            <div className='content-left'>
              <div className='title'>
                Objective Faculty Reviews
              </div>
              We impartially evaluate Cal Poly professors to provide insightful and balanced assessments. Our goal is to offer practical feedback on teaching styles, course content, and student experiences, helping you make informed decisions for your academic journey.
            </div>
            <div className='content-right'>
              <div className='title'>
                Learn From Student Reviews
              </div>
              Students like you seek a platform to openly share their authentic experiences with professors and courses. We thoroughly evaluate each submission to ensure its accuracy and value, helping students make well-informed academic decisions.
            </div>
          </div>
          <div className="typing-banner">
            <span className="dynamic-text" ref={dynamicTextRef}></span>
            {/* not displaying properly */}
            {/* <span className="cursor" ref={cursorRef}>|</span> */}
            <span className="cursor" ref={cursorRef}></span>
          </div>
          {/* <div className='social-wrap'>
            <div className='facebook-button btn'>
              <img src={facebookLogo}/>
            </div>
            <div className='tiktok-button btn'>
              <img src={tiktokLogo}/>
            </div>
            <div className='instagram-button btn'>
              <img src={instagramLogo}/>
            </div>


          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Directory;
