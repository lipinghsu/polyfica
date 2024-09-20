import React, { useState, useEffect } from 'react';
import RatingContainer from '../RatingContainer';
import shareIcon from '../../../assets/share_icon.png';
import commentIcon from '../../../assets/comment_icon.png';
import './CommentItem.scss'


const CommentItem = ({ comment, currentUser, handleLike, handleDislike, index, handleSubComment}) => {
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 840);

    // Update state based on window size
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 840);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    

    const handleShare = async (event) => {
        const shareData = {
            title: 'Check out this professor review',
            text: comment.reviewComment,
            url: window.location.href,
        };
        if (navigator.canShare) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            alert('Share feature is not supported in your browser.');
        }
    };

    return (
        <div className="commentItem">
            <div className="commentHeader">
                
                {/* make review button like reddit comment button */}
                <div className="commentContainer">
                    
                    <div className="commentTop">
                        <p className="commentUser">
                            @{comment.userName || 'Anonymous'}
                        </p>
                        <p className="commentCourse">
                            {comment.reviewCourseName}
                        </p>
                        <p className="commentDate">
                            {comment.reviewDates
                            ? (() => {
                                const date = new Date(comment.reviewDates.seconds * 1000);
                                const today = new Date();
                                
                                const options = {
                                    month: 'short',
                                    day: 'numeric',
                                };

                                // Add year if it's not the current year
                                if (date.getFullYear() !== today.getFullYear()) {
                                    options.year = 'numeric';
                                }

                                return date.toLocaleDateString('en-US', options);
                            })()
                            : 'No date available'
                            }
                        </p>
                    </div>

                    <p className="commentReview">{comment.reviewComment}</p>
                    <div className="likeDislikeShareContainer">
                        <div className="likeDislikeContainer">
                            <button
                                className={`likeButton ${comment.userLikes.includes(currentUser?.uid) ? 'liked' : ''}`}
                                onClick={() => handleLike(index)}
                            >
                                <span className="material-symbols-outlined">shift</span>
                            </button>
                            <span className="likeCount">{comment.likes || 0}</span>
                            <button
                                className={`dislikeButton ${comment.userDislikes.includes(currentUser?.uid) ? 'disliked' : ''}`}
                                onClick={() => handleDislike(index)}
                            >
                                <span className="material-symbols-outlined">shift</span>
                            </button>
                        </div>

                        <div className="shareContainer">
                            <button className="commentButton" onClick={handleSubComment}>
                                {isSmallScreen ? (
                                    <img src={commentIcon} alt="Comment Icon" />
                                ) : (
                                    <span className="material-icons">Comment</span>
                                )}
                            </button>
                        </div>

                        <div className="shareContainer">
                            <button className="shareButton" onClick={handleShare}>
                                {isSmallScreen ? (
                                    <img src={shareIcon} alt="Share Icon" />
                                ) : (
                                    <span className="material-icons">Share</span>
                                )}
                            </button>
                        </div>

                        {/* Move the RatingContainer to the right end */}
                        <RatingContainer
                            difficultyRating={comment.difficultyRating}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
