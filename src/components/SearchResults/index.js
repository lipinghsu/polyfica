import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom"; // Import useHistory
import { firestore } from "../../firebase/utils"; // Import Firestore instance

import "./SearchResults.scss"; // Import SCSS file

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  
  const [averageDifficultyRating, setAverageDifficultyRating] = useState(null);
  const location = useLocation();
  const history = useHistory(); // Initialize useHistory

  const searchTerm = new URLSearchParams(location.search).get("term");

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        if (!searchTerm) {
          return;
        }
        const professorsRef = firestore.collection("professors");
        const snapshot = await professorsRef
          .where("firstName", ">=", searchTerm)
          .where("firstName", "<=", searchTerm + "\uf8ff")
          .get();

        const results = snapshot.docs.map((doc) => doc.data());
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
  }, [searchTerm]);

  {/* Redirect to professor profile page */}
  const handleProfessorClick = (profID) => {
    history.push(`/search/professors/${profID}`); // Push to the specified URL
  };

  const matchesSearch = (professor) => {
    const searchTermLower = searchTerm?.toLowerCase() || ""; // Check for null
    const firstNameLower = professor.firstName.toLowerCase();
    const lastNameLower = professor.lastName.toLowerCase();
  
    return (
      firstNameLower.includes(searchTermLower) ||
      lastNameLower.includes(searchTermLower)
    );
  };

  return (
    <div className="searchResults">
      <div className="searchTermInfo">
        {searchTerm && (
          <p>
            {searchResults.length} professor{searchResults.length !== 1 ? "s" : ""} with "{searchTerm}" in their name
          </p>
        )}
      </div>
      {(
        <div>
          {searchResults.map((professor, index) => (
            matchesSearch(professor) && (
              <div key={index} className="professor" onClick={() => handleProfessorClick(professor.profID)}> 
                <div className="professorName">
                  {professor.firstName} {professor.lastName}
                </div>
                <div className="department">{professor.department}</div>
                <div className="schoolName">{professor.schoolName}</div>
                <div className="infoContainer">
                    <div className="averageRating">Difficulty: {averageDifficultyRating?.toFixed(1) || '-'}</div> {/* Add check for null */}
                    <div className="reviewCommentLength">
                        {professor.reviewComment?.length || 0} {professor.reviewComment?.length > 1 ? "reviews" : "review"}
                    </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
