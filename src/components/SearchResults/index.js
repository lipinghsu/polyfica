import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { firestore } from "../../firebase/utils";
import "./SearchResults.scss";
import ConditionalLink from "../Header/ConditionalLink";
import upArrow from "../../assets/arrow_up.png"; 
import searchImg from "../../assets/search-img.png";
import filter_icon from "../../assets/filter_icon.png";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};


const reviewOptions = [
  { id: 1, value: 'Any' },
  { id: 2, value: '25+' },
  { id: 3, value: '50+' },
  { id: 4, value: '100+' },
  { id: 5, value: '200+' }
];


// this is not working properly
const ratingOptions = [
  { id: 1, value: 'Any' },
  { id: 2, value: '2.0+' },
  { id: 3, value: '3.0+' },
  { id: 4, value: '4.0+' },
  { id: 5, value: '4.5+' }
];

const sortOptions = [
  { id: 1, value: "Alphabetical (Last Name)" },
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
  const [selectedReviewFilter, setSelectedReviewFilter] = useState('Any'); // New state for review filter
  const location = useLocation();
  const history = useHistory();
  const filterRef = useRef(null);
  const searchTerm = new URLSearchParams(location.search).get("term");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('Any');
  const [selectedSortOption, setSelectedSortOption] = useState("Alphabetical (Last Name)");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
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
        if (selectedRatingFilter && selectedRatingFilter !== 'Any') {
          const minRating = parseFloat(selectedRatingFilter);
          results = results.filter(professor =>
            professor.difficultyRating && parseFloat(professor.difficultyRating) >= minRating
          );
        }

        // Apply review count filter if selected
        if (selectedReviewFilter && selectedReviewFilter !== 'Any') {
          const reviewCount = parseInt(selectedReviewFilter);
          results = results.filter(professor =>
            professor.commentData && professor.commentData.length >= reviewCount
          );
        }

        sortResults(results, selectedSortOption);
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
    if (sortOption === "Alphabetical (Last Name)") {
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

  const handleRatingFilterClick = (value) => {
    setSelectedRatingFilter(value);
  };

  const handleDepartmentSearchChange = (event) => {
    setDepartmentSearchTerm(event.target.value.toLowerCase());
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

  const handleReviewFilterClick = (value) => {
    setSelectedReviewFilter(value);
  };

  const dropdownLabel = selectedDepartments.length > 0 
  ? selectedDepartments.join(", ") 
  : "Any";

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
              {searchResults.length} professor{searchResults.length !== 1 ? "s" : ""} with "<strong style={{ color: '#3EAE86' }}>{searchTerm}</strong>" in their name
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
            <div className={`filter-dropdown ${isSortDropdownVisible ? 'active' : ''}`} onClick={toggleSortDropdown}>
              <div className="dropdown-label">
                {selectedSortOption} {/* Display current selected option */}
              </div>
              <img
                src={upArrow}
                alt="Toggle Dropdown"
                className={`arrow-icon ${isSortDropdownVisible ? 'rotated' : ''}`}
              />
              <div className={isSortDropdownVisible ? "sort-options active" : "sort-options" }>
                {sortOptions.map((option) => (
                  <div
                    key={option.id}
                    className="sort-option"
                    onClick={() => handleSortChange(option.value)}
                  >
                    {option.value}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="inner-wrap bot">
            <div className="section-title">
              Search Filters
            </div>
            <div className="filter-title rating">
              Number of Reviews
            </div>
              <div className="filter-num-rev">
                {reviewOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`review-filter-button${selectedReviewFilter === option.value ? ' active' : ''}`}
                    onClick={() => handleReviewFilterClick(option.value)}
                  >
                    {option.value}
                  </button>
                ))}
              </div>

              {/* start of num rev filter */}
              <div className="filter-title">
                Rating
              </div>
              <div className="filter-num-rev">
                {ratingOptions.map((option) => (
                  <button
                    key={option.id}
                    className={`review-filter-button${selectedRatingFilter === option.value ? ' active' : ''}`}
                    onClick={() => handleRatingFilterClick(option.value)}
                  >
                    {option.value}
                  </button>
                ))}
              </div>
              
              {/* start of department filter */}
              <div className="filter-title">
                Department
              </div>
              <div className="filter-dropdown" ref={filterRef}>
                <div className="filter-top" >
                  <label htmlFor="department-filter" className="dropdown-label">
                    {dropdownLabel}
                  </label>
                  <img
                    src={upArrow}
                    alt="Toggle Dropdown"
                    className={`arrow-icon ${dropdownVisible ? 'rotated' : ''}`}
                  />
                </div>
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
          </div>
        </div>


        <div className="prof-wrap">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          ) : 
          (
            searchResults.map((professor, index) => (
              <div
                key={index}
                className="professor"
                onClick={() => handleProfessorClick(professor.id)}
              >
                <div className="professorName">
                  {professor.firstName} {professor.lastName}
                </div>
                <div className="department">{professor.department}</div>
                <div className="schoolName">{professor.schoolName}</div>
                <div className="infoContainer">
                  <div className="averageRating">
                    Difficulty: {" "}
                    {professor.commentData?.length > 0 
                      ? (
                          professor.commentData.reduce((acc, comment) => acc + parseFloat(comment.difficultyRating || 0), 0) 
                          / professor.commentData.length
                        ).toFixed(1) 
                      : "-"
                    }
                  </div>
                  <div className="reviewCommentLength">
                    {professor.commentData?.length || 0}{" "}
                    {professor.commentData?.length > 1 ? "reviews" : "review"}
                  </div>
                </div>
              </div>
              
            ))
          )}
          {searchResults.length >= 1 && (
            <div className="empty-div">
              {/* insert margin */}
            </div>
          )}

          <div className="search-bottom">
            <div className="box-top">
              <div className="img-box">
                <img src={searchImg} alt="search" />
              </div>
              <div className="text-box">
                <div className="text-a">
                  Can't find a professor?
                </div>
                <div className="text-b">
                  They may not be on <strong>Polyfica</strong> yet. Add them now and be the first to write a review!
                </div>
              </div>
            </div>
            <div className="review-btn">
              <ConditionalLink
                  text={("Write a Review")} 
                  link="/login" 
                  className={`review-btn`}
                  preventLink={true}
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
