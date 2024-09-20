import React, { useState, useEffect } from 'react';
import RatingSlider from '../Header/RatingSlider';
const MobilePopup = ({ professor, onSubmit, loading, onClose, isVisible }) => {
  const [startY, setStartY] = useState(0);
  const [currentTranslateY, setCurrentTranslateY] = useState(384);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCourseName, setReviewCourseName] = useState('');

  const [difficultyRating, setDifficultyRating] = useState(null);

  // Handle swipe down gesture to dismiss popup
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;

    if (diffY > 0) {
      setCurrentTranslateY(diffY); // Translate the popup as the user swipes
    }
  };

  const handleTouchEnd = () => {
    if (currentTranslateY > 150) {
      // If the swipe down is greater than 150px, close the popup
      setCurrentTranslateY(384);
      onClose();
    } else {
      // If the swipe was not enough, reset the popup to its original position
      setCurrentTranslateY(0);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth <= 840) {
        setCurrentTranslateY(0);
      } else {
        // Reset overflow to scroll when window is resized back to more than 840px
        setCurrentTranslateY(384);
      }
    };
  
    handleResize(); // Run on component mount
    window.addEventListener('resize', handleResize); // Add listener for window resize
  
    return () => {
      window.removeEventListener('resize', handleResize); // Cleanup listener on unmount
    };
  }, [window.innerWidth]);

  const handleSubmit = () => {
    onSubmit({
      reviewComment,
      reviewCourseName,
      difficultyRating,
    });
  };


  return (
    <div
      className={isVisible ? "mobile-review-popup" : "mobile-review-popup visible"}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={
        isVisible
          ? {
              transform: `translateY(${currentTranslateY}px)`,
              transition: 'transform 0.05s ease-in-out',
            }
          : {}
      }
    >
      <div className='column-wrap'>
        <div className="mobile-popup-top">
          <div className='mobile-popup-title'>Review Prof. {professor.lastName}</div>
          <span className="close-button" onClick={onClose}>&times;</span>
        </div>

        <div className="form-row rating-sliders">
          <input
            type="text"
            className="courseCodeInput"
            placeholder="Course Code"
            onChange={(e) => setReviewCourseName(e.target.value)}
          />
        </div>
        <div className="form-row rating-sliders bot">
          <div className="slider-label">Difficulty</div>
          <RatingSlider onChange={(value) => setDifficultyRating(value)} required />
        </div>
        <textarea
          onChange={(e) => setReviewComment(e.target.value)}
          className="expandedTextArea"
          placeholder="Write your review here..."
        />
        <button
          className={!loading ? "submitButton" : "submitButton loading"}
          type="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <div className="spinner"></div> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default MobilePopup;
