import React from 'react';

const RatingContainer = ({ qualityRating, difficultyRating }) => (
    <div className="ratingContainer">
        <div className='rating-wrap'>
            <div className="qualityRatingRow ratingRow">
                <div className="ratingValue">
                    {parseFloat(qualityRating).toFixed(1)}
                </div>
                <div className="ratingLabel">Quality</div>
            </div>
        </div>
        <div className='rating-wrap'>
            <div className="difficultyRatingRow ratingRow">
                <div className="ratingValue">
                    {parseFloat(difficultyRating).toFixed(1)}
                </div>
                <div className="ratingLabel">Difficulty</div>
            </div>
        </div>
    </div>
);

export default RatingContainer;
