import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // React Router v5
import upArrow from "../../../assets/arrow_up.png";
import './DropDown.scss';

const SortDropdown = ({ sortOptions, selectedSortOption, handleSortChange, className }) => {
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);
  const [currentValueURL, setCurrentValueURL] = useState("");
  const history = useHistory(); // Use history instead of useNavigate
  

  const toggleSortDropdown = () => {
    setIsSortDropdownVisible(!isSortDropdownVisible);
  };

  const handleSortOptionChange = (option) => {
    handleSortChange(option); // Call the parent-provided handler

    // Update the URL with the selected filter option
    const urlSearchParams = new URLSearchParams(window.location.search);
    // setCurrentValueURL(urlSearchParams + "");
    urlSearchParams.set('sort', option.value); 
    history.push(`?${urlSearchParams.toString()}`);
  };

  return (
    <div
      className={`filter-dropdown ${selectedSortOption.id === 1 ? '' : ' sortActive '} ${isSortDropdownVisible ? ' visible ' : ''} ${className ? className : ''}`}
      onClick={toggleSortDropdown}
    >
      <div className="dropdown-label">
        {selectedSortOption.value}
        {/* {currentValueURL} */}
      </div>
      
      <img
        src={upArrow}
        alt="Toggle Dropdown"
        className={`arrow-icon ${selectedSortOption.id === 1 ? '' : ' active '} ${isSortDropdownVisible ? 'rotated' : ''}`}
      />
      <div className={isSortDropdownVisible ? "sort-options active" : "sort-options"}>
        {sortOptions.map((option) => (
          <div
            key={option.id}
            className={`sort-option ${selectedSortOption.id === option.id ? 'selected' : ''}`} 
            onClick={() => handleSortOptionChange(option)}
          >
            <input
              type="radio"
              checked={selectedSortOption.id === option.id}
              onChange={() => handleSortOptionChange(option)}
            />
            <label>{option.value}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortDropdown;
