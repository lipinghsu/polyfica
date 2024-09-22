import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from "../../firebase/utils";
import { Rating } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';

import './styles.scss';

const getStarColor = (difficultyRating) => {
  // if (difficultyRating >= 5) {
  //     return '#028940';
  // } 
  // else if (difficultyRating >= 4) {
  //     return '#1B9E77';
  // } 
  // else if (difficultyRating >= 3) {
  //     return '#FF8F00';
  // } 
  // else if (difficultyRating >= 2) {
  //     return '#FFAB00';
  // } 
  // else if (difficultyRating >= 1) {
  //     return '#FFC20D';
  // } 
  // else {
  //     return 'transparent';
  // }
  return '#FF8F00';
};

  const TopReviews = (props) => {
  const [topReviews, setTopReviews] = useState([]); // Ensure this is an array
  const [maxLengths, setMaxLengths] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 840);
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const innerWrapRefs = useRef([]);

  useEffect(() => {
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
        setIsLoading(false); // Stop loading after fetching data
      } catch (error) {
        console.error("Error fetching top reviews:", error);
        setIsLoading(false); // Stop loading in case of error
      }
    };

    fetchTopReviews();
  }, []);

  useEffect(() => {
    const calculateMaxLengths = () => {
      const lengths = innerWrapRefs.current.map(ref => {
        const innerWrapWidth = ref ? ref.offsetWidth : 0;
        const charWidth = 7; // Average character width in pixels (adjust as necessary)
        const padding = 30; // Adjust for padding/margin
        return Math.floor((innerWrapWidth - padding) / (charWidth/6.5));
      });
      setMaxLengths(lengths);
    };

    calculateMaxLengths();
    window.addEventListener('resize', calculateMaxLengths);

    return () => {
      window.removeEventListener('resize', calculateMaxLengths);
    };
  }, [topReviews]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 840);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const renderSkeletonLoader = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <div className='item skeleton' key={`skeleton-${index}`}>
        <div className='inner-wrap'>
          <div className='top skeleton-bar'></div>

          <div className='center skeleton-bar'>
            <div className='review-content '></div>
          </div>

          <div className='bottom skeleton-bar'>
            <div className='user-prof-container'>
              <span className='user-name skeleton-bar'></span>
              <span className='prof-name skeleton-bar'></span>
            </div>
          </div>

        </div>
      </div>
    ));
  };

  return (
    <div className='top-reviews'>
      <h1 className='title'>
        The Latest Reviews from Students
      </h1>
      <div className={isMobile ? 'mobile-wrap' : 'wrap'}>
        {isLoading
          ? renderSkeletonLoader(isMobile ? 3 : 6) // Render skeleton loaders while loading
          : topReviews.slice(0, isMobile ? 3 : 6).map((review, index) => (
            <div className='item' key={index}>
              <div className='inner-wrap' ref={el => innerWrapRefs.current[index] = el}>
                <div className='top'>
                  <div className='rating-score'>
                    {/* Render stars based on rating using Material-UI Rating */}
                    <Rating 
                      value={review.difficultyRating} 
                      name="size-large" 
                      size="large" 
                      icon={<StarRoundedIcon fontSize="inherit" />}
                      emptyIcon={<StarBorderRoundedIcon fontSize="inherit" />}
                      readOnly 
                      style={{
                        color: getStarColor(review.difficultyRating),
                      }}
                    />
                  </div>
                </div>
                <div className='center'>
                  <div className='review-content'>
                    {maxLengths[index] !== undefined ? truncateText(review.reviewComment, maxLengths[index]) : review.reviewComment}
                  </div>
                </div>
                <div className='bottom'>
                  <div className='user-prof-container'>
                    <span className='user-name'>
                      {review.userName || 'Anonymous'} Reviewed&nbsp;
                    </span>
                    <span className='prof-name'>
                      <Link to={`/search/professors/${review.professorID}`}>
                        {`${review.professorName}`}
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {/* {renderEmptyItems(3 - topReviews.slice(0, isMobile ? 3 : 6).length)} */}
      </div>
    </div>
  );
};


export default TopReviews;