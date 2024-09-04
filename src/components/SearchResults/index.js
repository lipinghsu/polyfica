import React, { useEffect, useState, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { firestore } from "../../firebase/utils";
import "./SearchResults.scss";
import ConditionalLink from "../Header/ConditionalLink";
import upArrow from "../../assets/arrow_up.png"; 
import searchImg from "../../assets/search-img.png";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [averageDifficultyRating, setAverageDifficultyRating] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const filterRef = useRef(null);
  const searchTerm = new URLSearchParams(location.search).get("term");
  
  // collapse filter dropdown menu if user click outside of the div
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
      try {
        if (!searchTerm) {
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

        setSearchResults(results);

        const difficultyRatings = results.map((professor) => professor.difficultyRating || 0);
        const averageRating =
          difficultyRatings.length > 0
            ? difficultyRatings.reduce((acc, val) => acc + val) / difficultyRatings.length
            : null;
        setAverageDifficultyRating(averageRating);

        console.log("No results found:", results.length === 0);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    if (searchTerm) {
      fetchProfessors();
    } else {
      setSearchResults([]);
      setAverageDifficultyRating(null);
    }
  }, [searchTerm, selectedDepartments]);

  
  const handleProfessorClick = (profID) => {
    history.push(`/search/professors/${profID}`);
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

  const searchTermStyle = {
    color: '#3EAE86'
  };

  // Determine the label for the dropdown based on selected departments
  const dropdownLabel = selectedDepartments.length > 0 
    ? selectedDepartments.join(", ") 
    : "Department";
  
  return (
    <div className="search-result-wrap">
      <div className="searchTermInfo">
          {searchTerm && (
            <h2>
              {searchResults.length} professor{searchResults.length !== 1 ? "s" : ""} with "<strong style={searchTermStyle}>{searchTerm}</strong>" in their name
            </h2>
          )}
      </div>
      <div className="searchResults">
          <div className="filter-wrap">
            <div className="filter-dep" ref={filterRef}>
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
                <div className="department-list">
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
                </div>
              </div>
            </div>
          </div>

        <div className="prof-wrap">
          {searchResults.map((professor, index) => (
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
          ))}

          <div className="search-bottom">
            <div className="box-top">
              <div className="img-box">
                <img src={searchImg}/>
              </div>
              <div className="text-box">
                <div className="text-a">
                  Can't find a professor?
                </div>
                <div className="text-b">
                  They may not be on <strong>calpolyfica</strong> yet. Add them now and be the first to write a review!
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
