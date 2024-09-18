import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { firestore } from '../../../firebase/utils';
import { arrayUnion, arrayRemove } from "firebase/firestore";
import defaultProfileImage from "../../../assets/defaultProfImage.png";
import RatingSlider from "../../Header/RatingSlider";

const ProfessorDetails = ({ professor, currentUser }) => {
  const history = useHistory();
  const [hideMobilePopUp, setHideMobilePopUp] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 840);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [qualityRating, setQualityRating] = useState(null);
  const [difficultyRating, setDifficultyRating] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewCourseName, setReviewCourseName] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if(!hideMobilePopUp){
      document.body.style.overflow = "hidden";
    }
    else{
      document.body.style.overflow = "scroll";
    }
  }, [hideMobilePopUp]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 840);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Check if the user has liked or is following the professor
  useEffect(() => {
    if (currentUser && professor) {
      setHasLiked(professor.userLikes?.includes(currentUser.uid));
      setIsFollowing(professor.followers?.includes(currentUser.uid));
    }
  }, [currentUser, professor]);

  const handleUpload = async (event) => {
    event.preventDefault();

    if (qualityRating === null) {
      alert('Please provide a Quality Rating.');
      return;
    }

    if (difficultyRating === null) {
      alert('Please provide a Difficulty Rating.');
      return;
    }

    if (!reviewComment || reviewComment.trim() === '') {
      alert('Please provide a Review Comment.');
      return;
    }

    if (!reviewCourseName || reviewCourseName.trim() === '') {
      alert('Please provide the Course Code.');
      return;
    }

    setLoading(true);
    try {
      const newCommentData = {
        difficultyRating,
        qualityRating,
        reviewComment,
        reviewCourseName,
        reviewDates: new Date(),
        likes: 0,
        userLikes: [],
        userDislikes: []
      };

      const professorRef = firestore.collection('professors').doc(professor.profID);
      await professorRef.update({
        commentData: arrayUnion(newCommentData)
      });

      window.location.reload();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Like button click
  const handleLike = async () => {
    if (!currentUser) {
      // alert("Please log in to like.");
      history.push('/login');
      return;
    }

    const professorRef = firestore.collection('professors').doc(professor.profID);
    try {
      if (hasLiked) {
        // Remove like
        await professorRef.update({
          userLikes: arrayRemove(currentUser.uid)
        });
        setHasLiked(false);
      } else {
        // Add like
        await professorRef.update({
          userLikes: arrayUnion(currentUser.uid)
        });
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  // Handle Follow button click
  const handleFollow = async () => {
    if (!currentUser) {
      // alert("Please log in to follow.");
      history.push('/login');
      return;
    }

    const professorRef = firestore.collection('professors').doc(professor.profID);
    try {
      if (isFollowing) {
        // Unfollow
        await professorRef.update({
          followers: arrayRemove(currentUser.uid)
        });
        setIsFollowing(false);
      } else {
        // Follow
        await professorRef.update({
          followers: arrayUnion(currentUser.uid)
        });
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  const toggleFormExpansion = () => {
    if(!isFormExpanded){
      setIsFormExpanded(!isFormExpanded);
    }
  };

  const collapseForm = () => {
    setIsFormExpanded(false);
  };

  const toggleMobilePopUp = () => {
    setHideMobilePopUp(!hideMobilePopUp);
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
              <span className="number">{professor.followers?.length || 0}</span>{" "}
              <span className="count-text">{professor.followers?.length > 1 ? "followers" : "follower"}</span>
            </div>
            <div className="like-count">
              <span className="number">{professor.userLikes?.length || 0}</span>{" "}
              <span className="count-text">like{professor.userLikes?.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="button-wrap">
            {!isLargeScreen ? 
              <button className={`review-button-mobile ${!hideMobilePopUp ? " active" : ""}`} onClick={toggleMobilePopUp}>Review</button>
            : null}
            <button className={`follow-button ${isFollowing ? "following" : ""}`} onClick={handleFollow}>
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
            <button className={`like-button ${hasLiked ? "liked" : ""}`} onClick={handleLike}>
              {hasLiked ? "Unlike" : "Like"}
            </button>
          </div>
        </div>

        {isLargeScreen && (
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
        )}
      </div>

      {/* Pop-up modal for mobile review form */}
      <div className={!hideMobilePopUp && (window.innerWidth <= 840) ? "mobile-review-popup" : "mobile-review-popup visible"}>
        <div className='column-wrap'>
          <div className="mobile-popup-top">
            <div className='mobile-popup-title'>Review Prof. {professor.lastName}</div>
            <span className="close-button" onClick={() => setHideMobilePopUp(true)}>&times;</span>
          </div>

          <div className="form-row rating-sliders">
            <input type="text" className="courseCodeInput" placeholder="Course Code" onChange={e => setReviewCourseName(e.target.value)} />
          </div>
          <div className="form-row rating-sliders">
            <div className="slider-label">Quality</div>
            <RatingSlider onChange={(value) => setQualityRating(value)} required />
          </div>
          <div className="form-row rating-sliders bot">
            <div className="slider-label">Difficulty</div>
            <RatingSlider onChange={(value) => setDifficultyRating(value)} required />
          </div>
          <textarea onChange={e => setReviewComment(e.target.value)} className="expandedTextArea" placeholder="Write your review here..." />
          <button className={!loading ? "submitButton" : "submitButton loading"} type="submit" onClick={handleUpload} disabled={loading}>
            {loading ? <div className="spinner"></div> : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDetails;
