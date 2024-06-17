import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { firestore } from "../../firebase/utils"; 

import './styles.scss';

const TopReviews = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Function to fetch top 6 reviews
    const fetchTopReviews = async () => {
      try {
        const professorsRef = firestore.collection('professors');
        const snapshot = await professorsRef.get();
        let allReviews = [];

        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.commentData && data.commentData.length > 0) {
            data.commentData.forEach(review => {
              allReviews.push({
                ...review,
                professorName: `${data.firstName} ${data.lastName}`,
                professorID: data.profID
              });
            });
          }
        });

        allReviews.sort((a, b) => b.reviewDates.seconds - a.reviewDates.seconds);
        const topSixReviews = allReviews.slice(0, 6);
        setTopReviews(topSixReviews);
      } catch (error) {
        console.error("Error fetching top reviews:", error);
      }
    };

    fetchTopReviews();
  }, []);

  const handleSearchClick = () => {
    if (searchTerm.length > 0) {
      history.push(`/search/professors/term=${searchTerm}`);
    }
  };

  const renderEmptyItems = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <div className='item empty' key={`empty-${index}`}>
        <div className='inner-wrap'></div>
      </div>
    ));
  };

  return (
    <div className='top-reviews'>
      <h1 className='title'>
        The Latest Reviews from Students
      </h1>
      <div className='row'>
        <div className='wrap'>
          {topReviews.slice(0, 3).map((review, index) => (
            <div className='item' key={index}>
              <div className='inner-wrap'>
                
                <div className='top'>
                  <div className='rating-score'>
                    {/* Render stars based on rating */}
                    {"★".repeat(review.qualityRating)}
                  </div>
                </div>

                <div className='center'>
                  <div className='review-content'>
                    {review.reviewComment}
                  </div>
                </div>

                <div className='bottom'>
                  <div className='user-name'>
                    {review.userName || 'Anonymous'} Reviewed {review.professorName}
                  </div>
                </div>

              </div>
            </div>
          ))}
          {renderEmptyItems(3 - topReviews.slice(0, 3).length)}
        </div>
      </div>
      <div className='row'>
        <div className='wrap'>
          {topReviews.slice(3, 6).map((review, index) => (
            <div className='item' key={index}>
            <div className='inner-wrap'>
              
              <div className='top'>
                <div className='rating-score'>
                  {/* Render stars based on rating */}
                  {"★".repeat(review.qualityRating)}
                </div>
              </div>

              <div className='center'>
                <div className='review-content'>
                  {review.reviewComment}
                </div>
              </div>

              <div className='bottom'>
                <div className='user-name'>
                  {review.userName || 'Anonymous'} Reviewed {review.professorName}
                </div>
              </div>
            </div>
          </div>
          ))}
          {renderEmptyItems(3 - topReviews.slice(3, 6).length)}
        </div>
      </div>
    </div>
  );
};

export default TopReviews;
