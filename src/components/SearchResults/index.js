import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { firestore } from "../../firebase/utils";
import "./SearchResults.scss";
import ConditionalLink from "../Header/ConditionalLink";
import upArrow from "../../assets/arrow_up.png"; 
import searchImg from "../../assets/search-img.png";
import filter_icon from "../../assets/filter_icon.png";
import defaultProfileImage from "../../assets/defaultProfImage.png";
import { Rating } from '@mui/material'; 
import Dropdown from "./DropDown";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};


const reviewOptions = [
  { id: 1, value: 'Number of Reviews' },
  { id: 2, value: '25+' },
  { id: 3, value: '50+' },
  { id: 4, value: '100+' },
  { id: 5, value: '200+' }
];


// this is not working properly
const ratingOptions = [
  { id: 1, value: 'Rating' },
  { id: 2, value: '2.0+' },
  { id: 3, value: '3.0+' },
  { id: 4, value: '4.0+' },
  { id: 5, value: '4.5+' }
];

const sortOptions = [
  { id: 1, value: "Default" },
  { id: 2, value: "Alphabetical (First Name)" },
  { id: 3, value: "Highest Rating" },
  { id: 4, value: "Most Reviews" },
];

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [averageDifficultyRating, setAverageDifficultyRating] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedReviewFilter, setSelectedReviewFilter] = useState({id: 1, value: 'Number of Reviews'}); // New state for review filter
  const location = useLocation();
  const history = useHistory();
  const filterRef = useRef(null);
  const searchTerm = new URLSearchParams(location.search).get("term");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState({id: 1, value: "Rating"});
  const [selectedSortOption, setSelectedSortOption] = useState({id: 1, value: "Default"});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isReviewDropdownVisible, setIsReviewDropdownVisible] = useState(false);
  const [isRatingDropdownVisible, setIsRatingDropdownVisible] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayedProfessors, setDisplayedProfessors] = useState(8);

  const boxRightRef = useRef();
  const movingDivRef = useRef();
  const [stop, setStop] = useState(false);
  
  const toggleSortDropdown = () => {
    setIsSortDropdownVisible(!isSortDropdownVisible);
  };
  const handleSortChange = (option) => {
    setSelectedSortOption(option);
    setIsSortDropdownVisible(false);
  };


  const toggleReviewDropdown = () => {
    setIsReviewDropdownVisible(!isReviewDropdownVisible);
  };

  const toggleRatingDropdown = () => {
    setIsRatingDropdownVisible(!isRatingDropdownVisible);
  };  

  useEffect(() => {
    window.scrollTo(0, 0);
  },[])

  // Effect to track window size changes
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1020) {
        setIsFilterVisible(false);
      } else {
        setIsFilterVisible(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight && !loadingMore) {
        if (displayedProfessors < searchResults.length) {
          setLoadingMore(true);
          setTimeout(() => {
            setDisplayedProfessors((prevCount) => Math.min(prevCount + 8, searchResults.length)); // Increase by 8 or until all professors are shown
            setLoadingMore(false);
          }, 500);
        }
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadingMore, displayedProfessors, searchResults.length]);

  // collapse filter dropdown menu if user clicks outside of the div
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const professorsRef = firestore.collection("professors");
        const professorsSnapshot = await professorsRef.get();
        const departmentSet = new Set();
        
        professorsSnapshot.forEach((doc) => {
          const department = doc.data().department;
          if (department) {
            departmentSet.add(department);
          }
        });

        const departmentList = Array.from(departmentSet).sort();
        setDepartments(departmentList);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchProfessors = async () => {
      setLoading(true);
      try {
        if (!searchTerm) {
          setLoading(false);
          return;
        }

        const professorsRef = firestore.collection("professors");
        let results = [];
        const searchTerms = searchTerm.split(" ").map(term => term.toLowerCase());

        const allProfessorsSnapshot = await professorsRef.get();
        let allProfessors = [];
        allProfessorsSnapshot.forEach((doc) => allProfessors.push({ id: doc.id, ...doc.data() }));

        results = allProfessors.filter(professor =>
          searchTerms.every(term =>
            professor.firstName.toLowerCase().includes(term) ||
            professor.lastName.toLowerCase().includes(term)
          )
        );

        // Apply department filter if any selected
        if (selectedDepartments.length > 0) {
          results = results.filter(professor =>
            selectedDepartments.includes(professor.department)
          );
        }

        // Apply rating filter if selected
        if (selectedRatingFilter && selectedRatingFilter.value !== 'Rating') {
          // Remove the + sign and parse the value to a number
          const minRating = parseFloat(selectedRatingFilter.value.replace('+', ''));
          results = results.filter(professor =>
            professor.difficultyRating && parseFloat(professor.difficultyRating) >= minRating
          );
        }

        // Apply review count filter if selected
        if (selectedReviewFilter && selectedReviewFilter.value !== 'Number of Reviews') {
          const reviewCount = parseInt(selectedReviewFilter.value);
          results = results.filter(professor =>
            professor.commentData && professor.commentData.length >= reviewCount
          );
        }

        sortResults(results, selectedSortOption.value);
        setSearchResults(results);

        const difficultyRatings = results.map((professor) => professor.difficultyRating || 0);
        const averageRating =
          difficultyRatings.length > 0
            ? difficultyRatings.reduce((acc, val) => acc + val) / difficultyRatings.length
            : null;
        setAverageDifficultyRating(averageRating);

        console.log("No results found:", results.length === 0);
      } 
      catch (error) {
        console.error("Error fetching professors:", error);
      }
      finally {
        setLoading(false); // Set loading to false once data is fetched
      }

    };

    if (searchTerm) {
      fetchProfessors();
    } 
    else {
      setSearchResults([]);
      setAverageDifficultyRating(null);
      setLoading(false);
    }
  }, [searchTerm, selectedDepartments, selectedReviewFilter, selectedRatingFilter, selectedSortOption]);

  const sortResults = (results, sortOption) => {
    if (sortOption === "Default") {
      results.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } 
    else if(sortOption === "Alphabetical (First Name)") {
      results.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } 
    else if (sortOption === "Highest Rating") {
      results.sort((a, b) => (b.difficultyRating || 0) - (a.difficultyRating || 0));
    } 
    else if (sortOption === "Most Reviews") {
      results.sort((a, b) => (b.commentData?.length || 0) - (a.commentData?.length || 0));
    }
  };

  

  
  const handleProfessorClick = (profID) => {
    history.push(`/search/professors/${profID}`);
  };

  const handleRatingFilterClick = (option) => {
    setSelectedRatingFilter(option);
  };

  const handleDepartmentSearchChange = (event) => {
    setDepartmentSearchTerm(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    const value = event.target.value;
    setSelectedDepartments((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((dept) => dept !== value)
        : [...prevSelected, value]
    );
  };

  const toggleDropdown = (event) => {
    // Prevent the event from propagating to the document
    event.stopPropagation(); 
    setDropdownVisible(!dropdownVisible);
  };

  const filteredDepartments = departments.filter(department =>
    department.toLowerCase().includes(departmentSearchTerm)
  );

  const handleReviewFilterClick = (option) => {
    setSelectedReviewFilter(option);
  };

  const dropdownLabel = selectedDepartments.length > 0 
  ? selectedDepartments.join(", ") 
  : "Department";

  const controlMovingDiv = () => {
    if (windowWidth >= 1020) { // Only move when window width is >= 1020px
      const boxRightBottomY = (boxRightRef.current?.offsetHeight + boxRightRef.current?.offsetTop);
      const stopPosition = boxRightBottomY - movingDivRef.current?.offsetHeight - 20; // 20px above the bottom
  
      if (typeof window !== 'undefined') {
        if (window.scrollY + 340 > stopPosition) {
          setStop(true);
        } else {
          setStop(false);
        }
      }
    } else {
      setStop(true);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("scroll", controlMovingDiv);
      return () => {
        window.removeEventListener('scroll', controlMovingDiv);
      };
    }
  }, [windowWidth]); 



  return (
    <div className="search-result-wrap">
      <div className="searchTermInfo">
          {searchTerm && (
            <h2>
              {searchResults.length} professor{searchResults.length !== 1 ? "s" : ""} with "<strong style={{ color: '#008938' }}>{searchTerm}</strong>" in their name
              
            </h2>
          )}
      </div>
      {windowWidth < 1020 && (
        <button className={isFilterVisible ? "toggle-filter-btn active" : "toggle-filter-btn"} onClick={() => setIsFilterVisible(!isFilterVisible)}>
          {isFilterVisible ? "Hide Filters" : "Show Filters"}
        </button>
      )}

      <div className="searchResults">
        <div
          className={isFilterVisible ? "filter-wrap visible" : "filter-wrap"}
          ref={movingDivRef}
          style={
            stop ? {
              position: 'relative', // Make the position relative when movement is stopped
              top: 'auto'
            } : {
              position: 'sticky',
              top: 64
            }
          }
        >
          <div className="inner-wrap top">
            {/* sort */}
            <div className="section-title">
              Sort By
            </div>
            <Dropdown
              sortOptions={sortOptions}
              selectedSortOption={selectedSortOption} 
              handleSortChange={handleSortChange}
            />
          </div>

          <div className="inner-wrap bot">
            <div className="section-title">
              Search Filters
            </div>
            <Dropdown
              sortOptions={ratingOptions}
              selectedSortOption={selectedRatingFilter}
              handleSortChange={handleRatingFilterClick}
            />
  
            {/* start of department filter */}
              <div className="filter-dropdown" ref={filterRef}>
                {/* <div className="filter-top" > */}
                <div className="dropdown-label">
                  {dropdownLabel}
                </div>
                <img
                  src={upArrow}
                  alt="Toggle Dropdown"
                  className={`arrow-icon ${dropdownVisible ? 'rotated' : ''}`}
                />
                {/* </div> */}
                <div className="filter-overlay" onClick={toggleDropdown}>
                  {/* this is a transparent div on top of filter-top */}
                </div>
                <div className={dropdownVisible? "department-dropdown active" : "department-dropdown"}>
                  <input
                    type="text"
                    placeholder="Search department"
                    value={departmentSearchTerm}
                    onChange={handleDepartmentSearchChange}
                    className="department-search"
                  />
                  {dropdownVisible && (<div className="department-list">
                    {filteredDepartments.map((dept, index) => (
                      <label
                        key={index}
                        className={`department-option ${selectedDepartments.includes(dept) ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          value={dept}
                          checked={selectedDepartments.includes(dept)}
                          onChange={handleDepartmentChange}
                        />
                        {capitalizeFirstLetter(dept)}
                      </label>
                    ))}
                  </div>)}
                </div>
            </div>
            <Dropdown
              sortOptions={reviewOptions}
              selectedSortOption={selectedReviewFilter}
              handleSortChange={handleReviewFilterClick}
            />
          </div>
        </div>

        <div className="prof-wrap">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : 
          searchResults.length > 0 ? (
            searchResults.slice(0, displayedProfessors).map((professor, index) => (
              <div key={index} className="item-wrap">
                <div className="professor" onClick={() => handleProfessorClick(professor.id)}>
                  <div className="profileImage-wrap">
                    {professor.profileImage ? (
                      <img src={professor.profileImage} alt={`${professor.firstName} ${professor.lastName}`} />
                    ) : (
                      <img src={defaultProfileImage} alt="Default Profile" />
                    )}
                  </div>
                  <div className="prof-content">
                    <div className="infoHeader">
                      <div className="professorName">{professor.firstName} {professor.lastName}</div>
                      <div className="rating-score">
                        <Rating precision={0.5} value={professor.difficultyRating} name="size-large" size="large" readOnly />
                      </div>
                    </div>
                    <div className="department">{professor.department}</div>
                    <div className="infoFooter">
                      <div className="schoolName">{professor.schoolName}</div>
                      <div className="reviewCommentLength">
                        {professor.commentData?.length || 0} {professor.commentData?.length > 1 ? "reviews" : "review"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : 
          <div className="no-result">
            <div className="text-a">
              Hmm... no professor profiles match '{searchTerm}'
            </div>
            <div className="text-b">
              Try checking the spelling or use different keywords to refine your search.
            </div>
          </div>
          }
          
          {loadingMore && displayedProfessors < searchResults.length && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}
          {displayedProfessors >= searchResults.length &&
            <div className="empty-div"/>
          }
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
