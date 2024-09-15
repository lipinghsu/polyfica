import React, { useState } from "react";
import upArrow from "../../../assets/arrow_up.png";
import './DropDown.scss';

const SortDropdown = ({ sortOptions, selectedSortOption, handleSortChange, className }) => {
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);

  const toggleSortDropdown = () => {
    setIsSortDropdownVisible(!isSortDropdownVisible);
  };

  return (
    <div className={`filter-dropdown ${isSortDropdownVisible ? 'active ' : ''} ${className ? className : ''}`} onClick={toggleSortDropdown}>
      <div className="dropdown-label">
        {selectedSortOption.value} {/* Display current selected option */}
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
            className={`sort-option ${selectedSortOption.id === option.id ? 'selected' : ''}`} // Add 'selected' class for the active option
            onClick={() => handleSortChange(option)}
          >
            {option.value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortDropdown;
