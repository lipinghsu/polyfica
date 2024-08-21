import React, { useState } from "react";
import './styles.scss';

const sizeOptions = [
  { id: 1, value: '1' },
  { id: 2, value: '2' },
  { id: 3, value: '3' },
  { id: 4, value: '4' },
  { id: 5, value: '5' }
];

export default function RatingSlider() {
  const [hovered, setHovered] = useState(null);
  const [current, setCurrent] = useState(null);

  function handleMouseEnter(size) {
    setHovered(size.id);
  }

  function handleMouseLeave() {
    setHovered(null);
  }
  function handleSelectedButton(size) {
    setCurrent(size.id);
  }

  return (
    <div className="button-group-container">
      {sizeOptions.map((sizeOption) => {
        const isActive = current >= sizeOption.id;
        const buttonClass = `button-container${isActive ? " active" : ""} ${hovered ? ` hovered-${hovered}` : ""}`;
        return (
          <div
            className={buttonClass}
            key={sizeOption.id}
            onClick={() => handleSelectedButton(sizeOption)}

            onMouseEnter={() => handleMouseEnter(sizeOption)}
            onMouseLeave={handleMouseLeave}
          >
            
            <div className="button">
            </div>
          </div>
        );
      })}
    </div>
  );
}
