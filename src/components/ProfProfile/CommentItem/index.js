import React from 'react';
import RatingContainer from '../RatingContainer';

const CommentItem = ({ comment, currentUser, handleLike, handleDislike, index }) => {
    const handleShare = async(event) => {
        const shareData = {
            title: 'Check out this professor review',
            text: comment.reviewComment,
            url: window.location.href
        }
        if (navigator.canShare) {
            navigator.share(shareData).catch(
                (error) => console.log('Error sharing', error)
            );
            try {
                await navigator.share(shareData);
              } 
            catch (error) {
                // output.textContent = `Error: ${error.message}`;
            }
        } 
        else {
            alert('Share feature is not supported in your browser.');
        }
    };

    return (
        <div className="commentItem">
            <div className="commentHeader">
                <RatingContainer
                    qualityRating={comment.qualityRating}
                    difficultyRating={comment.difficultyRating}
                />
                <div className='commentContainer'>
                    <div className="commentTop">
                        <p className="commentCourse">{comment.reviewCourseName}</p>
                        <p className="commentDate">
                            {comment.reviewDates
                                ? new Date(comment.reviewDates.seconds * 1000).toLocaleDateString()
                                : 'No date available'}
                        </p>
                    </div>
                    <p className="commentReview">{comment.reviewComment}</p>
                    <div className="likeDislikeShareContainer">
                    <div className="likeDislikeContainer">
                    <button className={`likeButton ${comment.userLikes.includes(currentUser?.uid) ? 'liked' : ''}`} onClick={() => handleLike(index)}>
                        <span class="material-symbols-outlined">shift</span>
                    </button>
                    <span className="likeCount">{comment.likes || 0}</span>
                    <button className={`dislikeButton ${comment.userDislikes.includes(currentUser?.uid) ? 'disliked' : ''}`} onClick={() => handleDislike(index)}>
                        <span class="material-symbols-outlined">shift</span>
                    </button>
                </div>
                        <div className="shareContainer">
                            <button className="shareButton" onClick={handleShare}>
                                <span className="material-icons">Share</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
