import React, { useState, useEffect } from 'react';
import { storage, firestore } from '../../../firebase/utils';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import defaultProfileImage from "../../../assets/defaultProfImage.png";
import RatingSlider from "../../Header/RatingSlider";

function calculateAverageQualityRating(commentData) {
  if (!commentData || commentData.length === 0) {
    return 0;
  }
  const totalQualityRating = commentData.reduce((acc, comment) => acc + (comment.qualityRating || 0), 0);
  return (totalQualityRating / commentData.length).toFixed(1);
}

const ProfessorDetails = ({ professor }) => {
  
  
  const [showMobilePopUp, setShowMobilePopUp] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 840);
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  const [qualityRating, setQualityRating] = useState(null);
  const [difficultyRating, setDifficultyRating] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCourseName, setReviewCourseName] = useState('');
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 840);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (qualityRating === null || difficultyRating === null) {
      alert('Please provide both Quality Rating and Difficulty Rating.');
      return;
    }

    setLoading(true); // Start loading spinner
    try {
      const newCommentData = {
        difficultyRating: difficultyRating,
        qualityRating: qualityRating,
        reviewComment: reviewComment,
        reviewCourseName: reviewCourseName,
        reviewDates: new Date(),
        likes: 0,
        userLikes: [],
        userDislikes: []
      };

      const professorRef = firestore.collection('professors').doc(professor.profID);
      await professorRef.update({
        commentData: arrayUnion(newCommentData)
      });

      window.location.reload(); // Refresh page after successful upload
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  const toggleFormExpansion = () => {
    if (!isFormExpanded) {
      setIsFormExpanded(!isFormExpanded);
    }
  };

  const collapseForm = () => {
    if (isFormExpanded) {
      setIsFormExpanded(!isFormExpanded);
    }
  };

  const toggleMobilePopUp = () => {
    setShowMobilePopUp(!showMobilePopUp); // Toggle the pop-up
  };

  return (
    <div className="profDetails">
      <div className="profHeader">
        <div className="top-wrap">
          <div className="profileImage-wrap">
            {professor.profileImage ? (
              <img src={professor.profileImage} alt={`${professor.firstName} ${professor.lastName}`} />
            ) : (
              <img src={defaultProfileImage} alt="Default Profile" />
            )}
          </div>
        </div>

        <h2 className="profName">{professor.firstName} {professor.lastName}</h2>
        <p className="profIntro">
          Professor in the <b>{professor.department}</b> department at <b>{professor.schoolName}</b>
        </p>

        <div className="bottom-wrap">
          <div className="count-wrap">
            <div className="review-count">
              <span className="number">{professor.commentData?.length || 0}</span>{" "}
              <span className="count-text">{professor.commentData?.length > 1 ? "reviews" : "review"}</span>
            </div>
            <div className="follower-count">
              <span className="number">0</span> <span className="count-text">follower</span>
            </div>
            <div className="like-count">
              <span className="number">0</span> <span className="count-text">like</span>
            </div>
          </div>

          <div className="button-wrap">
            {!isLargeScreen ? 
              <button className="review-button-mobile" onClick={toggleMobilePopUp}>Review</button>
            : null}
            <button className="follow-button">Follow</button>
            <button className="like-button">Like</button>
          </div>
        </div>

        {isLargeScreen ? (
          <div className={isFormExpanded ? "review-form expanded" : "review-form"} onClick={toggleFormExpansion}>
            {!isFormExpanded ? 
            <div className='text-form-collapsed'>Write a Review</div> 
            : 
            <div className="commentForm">
              <form>
                <textarea onChange={e => setReviewComment(e.target.value)} className="expandedTextArea" placeholder="Write your review here..." />
                <div className="courseCodeContainer">
                  <div className='column-wrap'>
                    <div className="form-row rating-sliders">
                      <div className="slider-label">Course Code</div>
                      <input type="text" className="courseCodeInput" placeholder="Course Code" onChange={e => setReviewCourseName(e.target.value)} />
                    </div>
                    <div className="form-row rating-sliders">
                      <div className="slider-label">Quality</div>
                      <RatingSlider onChange={(value) => setQualityRating(value)} required />
                    </div>
                    <div className="form-row rating-sliders">
                      <div className="slider-label">Difficulty</div>
                      <RatingSlider onChange={(value) => setDifficultyRating(value)} required />
                    </div>
                  </div>

                  <div className="buttonGroup">
                    <button className="cancelButton" type="button" onClick={collapseForm}>Cancel</button>
                    <button className={!loading ? "submitButton" : "submitButton loading"} type="submit" onClick={handleUpload} disabled={loading}>
                      {loading ? <div className="spinner"></div> : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>}
          </div>
        ) : null}
      </div>
      {/* Pop-up modal for mobile review form */}
      <div className={showMobilePopUp ? "mobile-popup visible" : "mobile-popup"}>
        <div className='column-wrap'>
          <div className="form-row rating-sliders">
            <input type="text" className="courseCodeInput" placeholder="Course Code" onChange={e => setReviewCourseName(e.target.value)} />
          </div>

          <textarea onChange={e => setReviewComment(e.target.value)} className="expandedTextArea" placeholder="Write your review here..." />

          <div className="form-row rating-sliders">
            <div className="slider-label">Quality</div>
            <RatingSlider onChange={(value) => setQualityRating(value)} required />
          </div>
          <div className="form-row rating-sliders">
            <div className="slider-label">Difficulty</div>
            <RatingSlider onChange={(value) => setDifficultyRating(value)} required />
          </div>

          
          <button className={!loading ? "submitButton" : "submitButton loading"} type="submit" onClick={handleUpload} disabled={loading}>
            {loading ? <div className="spinner"></div> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDetails;
