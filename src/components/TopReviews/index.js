import React, { useEffect, useState, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LuSearch } from 'react-icons/lu';
import { firestore } from "../../firebase/utils";
import { Rating } from '@mui/material';

import './styles.scss';

const TopReviews = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [topReviews, setTopReviews] = useState([]); // Ensure this is an array
  const [maxLengths, setMaxLengths] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 840);
  const history = useHistory();
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
      } catch (error) {
        console.error("Error fetching top reviews:", error);
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

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className='top-reviews'>
      <h1 className='title'>
        The Latest Reviews from Students
      </h1>
      <div className={isMobile ? 'mobile-wrap' : 'wrap'}>
        {topReviews.slice(0, isMobile ? 3 : 6).map((review, index) => (
          <div className='item' key={index}>
            <div className='inner-wrap' ref={el => innerWrapRefs.current[index] = el}>
              <div className='top'>
                <div className='rating-score'>
                  {/* Render stars based on rating using Material-UI Rating */}
                  <Rating value={review.qualityRating} name="size-large" size="large" readOnly />
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
        {renderEmptyItems(3 - topReviews.slice(0, isMobile ? 3 : 6).length)}
      </div>
    </div>
  );
};

export default TopReviews;
