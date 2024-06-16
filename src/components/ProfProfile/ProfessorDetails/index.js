import React from 'react';
function calculateAverageQualityRating(commentData) {
    if (!commentData || commentData.length === 0) {
        return 0;
    }
    const totalQualityRating = commentData.reduce((acc, comment) => acc + (comment.qualityRating || 0), 0);
    return (totalQualityRating / commentData.length).toFixed(1);
}
const ProfessorDetails = ({ professor }) => (
    <div className="profDetails">
        <div className="profHeader">
            <h2 className="profName">{professor.firstName} {professor.lastName}</h2>
            <p>Professor in the {professor.department} department at {professor.schoolName}.</p>
        </div>
        {professor.commentData ? (
            <>
                <div className="averageRating">
                    <div className="progressBar">
                        <div
                            className="progress"
                            style={{
                                width: `${(calculateAverageQualityRating(professor.commentData) / 5) * 100}%`,
                                backgroundColor: `hsl(${(calculateAverageQualityRating(professor.commentData) / 5) * 120}, 100%, 50%)`
                            }}
                        />
                    </div>
                    <p>Overall Quality Based on {professor.commentData.length} Ratings</p>
                </div>
            </>
        ) : (
            <p>Overall Quality Based on 0 ratings</p>
        )}
    </div>
);

export default ProfessorDetails;
