import React, { useState } from 'react';

const CommentForm = ({
    isFormExpanded,
    newComment,
    handleCommentChange,
    qualityRating,
    handleQualityRating,
    difficultyRating,
    handleDifficultyRating,
    courseCode,
    handleCourseCodeChange,
    handleProfessorUpload,
    handleFormClick,
    handleFormCollapse
}) => {
    return (
        <div className="commentForm" onClick={handleFormClick}>
            <form
                onSubmit={handleProfessorUpload}
                className={isFormExpanded ? 'expandedForm' : 'collapsedForm'}
            >
                <textarea
                    className={isFormExpanded ? 'expandedTextArea' : 'collapsedTextArea'}
                    placeholder="Add a comment"
                    value={newComment}
                    onChange={handleCommentChange}
                    required
                ></textarea>
                {isFormExpanded && (
                    <>
                        <div className="ratingInputs">
                            <label>Quality Rating:</label>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    type="button"
                                    key={"quality" + rating}
                                    onClick={() => handleQualityRating(rating)}
                                    className={`ratingButton ${qualityRating === rating ? 'active' : ''}`}
                                >
                                    {rating}
                                </button>
                            ))}
                            <label>Difficulty Rating:</label>
                            {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                    type="button"
                                    key={"difficulty" + rating}
                                    onClick={() => handleDifficultyRating(rating)}
                                    className={`ratingButton ${difficultyRating === rating ? 'active' : ''}`}
                                >
                                    {rating}
                                </button>
                            ))}
                        </div>
                        <div className="courseCodeContainer">
                            <label>Course Code:</label>
                            <input
                                className="courseCodeInput"
                                type="text"
                                value={courseCode}
                                onChange={handleCourseCodeChange}
                                placeholder="Enter course code"
                                required
                            />
                            <div className="buttonGroup">
                                <button type="submit" className="submitButton">Submit</button>
                                <button type="button" className="cancelButton" onClick={handleFormCollapse}>Cancel</button>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default CommentForm;
