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
        const searchTerms = searchTerm.split(" ").map(capitalizeFirstLetter);

        if (searchTerms.length === 1) {
          // Single search term: search by either firstName or lastName
          const snapshotFirstName = await professorsRef
            .where("firstName", ">=", searchTerms[0])
            .where("firstName", "<=", searchTerms[0] + "\uf8ff")
            .get();

          const snapshotLastName = await professorsRef
            .where("lastName", ">=", searchTerms[0])
            .where("lastName", "<=", searchTerms[0] + "\uf8ff")
            .get();

          // Combine all snapshots into one array of unique documents
          const combinedResults = new Map();
          snapshotFirstName.forEach((doc) =>
            combinedResults.set(doc.id, doc.data())
          );
          snapshotLastName.forEach((doc) =>
            combinedResults.set(doc.id, doc.data())
          );

          results = Array.from(combinedResults.values());
        } else if (searchTerms.length === 2) {
          // Two search terms: search by firstName and then check lastName
          const [firstNameTerm, lastNameTerm] = searchTerms;

          const snapshotFirstName = await professorsRef
            .where("firstName", ">=", firstNameTerm)
            .where("firstName", "<=", firstNameTerm + "\uf8ff")
            .get();

          const filteredResults = [];
          snapshotFirstName.forEach((doc) => {
            const data = doc.data();
            if (
              data.lastName &&
              data.lastName.toLowerCase().startsWith(lastNameTerm.toLowerCase())
            ) {
              filteredResults.push(data);
            }
          });

          results = filteredResults;
        } else {
          // Handle cases with more than two terms if necessary
          console.warn(
            "Search term contains more than two words, this case is not handled."
          );
        }

        setSearchResults(results);

        const difficultyRatings = results.map(
          (professor) => professor.difficultyRating || 0
        );
        const averageRating =
          difficultyRatings.length > 0
            ? difficultyRatings.reduce((acc, val) => acc + val) /
              difficultyRatings.length
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

  const matchesSearch = (professor) => {
    if (!searchTerm) return true;

    const searchTerms = searchTerm.toLowerCase().split(" ");
    if (searchTerms.length === 1) {
      return (
        professor.firstName.toLowerCase().startsWith(searchTerms[0]) ||
        professor.lastName.toLowerCase().startsWith(searchTerms[0])
      );
    } else if (searchTerms.length === 2) {
      return (
        professor.firstName.toLowerCase().startsWith(searchTerms[0]) &&
        professor.lastName.toLowerCase().startsWith(searchTerms[1])
      );
    }
    return false;
  };

  return (
    <div className="searchResults">
      <div className="searchTermInfo">
        {searchTerm && (
          <p>
            {searchResults.length} professor
            {searchResults.length !== 1 ? "s" : ""} with "{searchTerm}" in their
            name
          </p>
        )}
      </div>
      <div>
        {searchResults.map(
          (professor, index) =>
            matchesSearch(professor) && (
              <div
                key={index}
                className="professor"
                onClick={() => handleProfessorClick(professor.profID)}
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
            )
        )}
      </div>
    </div>
  );
};

export default SearchResults;
