import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { firestore } from "../../firebase/utils";
import "./SearchResults.scss";

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [averageDifficultyRating, setAverageDifficultyRating] = useState(null);
  const location = useLocation();
  const history = useHistory();
  const searchTerm = new URLSearchParams(location.search).get("term");

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        if (!searchTerm) {
          return;
        }

        const professorsRef = firestore.collection("professors");
        let results = [];
        const searchTerms = searchTerm.split(" ").map(term => term.toLowerCase());

        // Fetch all professors and filter results in application code
        const allProfessorsSnapshot = await professorsRef.get();
        let allProfessors = [];
        allProfessorsSnapshot.forEach((doc) => allProfessors.push({ id: doc.id, ...doc.data() }));

        results = allProfessors.filter(professor =>
          searchTerms.every(term =>
            professor.firstName.toLowerCase().includes(term) ||
            professor.lastName.toLowerCase().includes(term)
          )
        );

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

  const handleProfessorClick = (profID) => {
    history.push(`/search/professors/${profID}`);
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
      <div>
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
                Difficulty: {averageDifficultyRating?.toFixed(1) || "-"}
              </div>
              <div className="reviewCommentLength">
                {professor.reviewComment?.length || 0}{" "}
                {professor.reviewComment?.length > 1 ? "reviews" : "review"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
