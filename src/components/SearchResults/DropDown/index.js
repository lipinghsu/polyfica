
import React, { useState } from "react";
import upArrow from "../../../assets/arrow_up.png";
import './DropDown.scss';

const SortDropdown = ({ sortOptions, selectedSortOption, handleSortChange }) => {
  const [isSortDropdownVisible, setIsSortDropdownVisible] = useState(false);

  const toggleSortDropdown = () => {
    setIsSortDropdownVisible(!isSortDropdownVisible);
  };

  return (
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
  );
};

export default SortDropdown;
