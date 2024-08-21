import React, { useState } from "react";
import './styles.scss';

let sizeOptions = [
  { id: 1, value: '1' },
  { id: 2, value: '2' },
  { id: 3, value: '3' },
  { id: 4, value: '4' },
  { id: 5, value: '5' }
];

export default function SizeButton() {
  const [current, setCurrent] = useState(null);

  function handleSelectedButton(size) {
    setCurrent(size.id);
  }

  return (
    <div className="button-group-container">
      {sizeOptions.map((sizeOption, index) => {
        const isActive = current >= sizeOption.id;
        const isBeforeActive = current > sizeOption.id;
        const buttonClass = `button-container${isActive ? " active" : ""}${isBeforeActive ? " before-active" : ""}`;
        return (
          <div
            className={buttonClass}
            key={index}
            onClick={() => handleSelectedButton(sizeOption)}
          >
            <div className="button"></div>
          </div>
        );
      })}
    </div>
  );
}
