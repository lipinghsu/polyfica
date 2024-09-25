import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from "../../firebase/utils";
import { Rating } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import './styles.scss';

const getStarColor = (difficultyRating) => '#FF8F00';

const TopReviews = () => {
  const [topReviews, setTopReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const marqueeRef = useRef(null);

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
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching top reviews:", error);
        setIsLoading(false);
      }
    };

    fetchTopReviews();
  }, []);

  useEffect(() => {
    const marquee = marqueeRef.current;
    let animationFrameId;

    const scrollMarquee = () => {
      // Scroll the marquee container to the left
      marquee.scrollLeft += 1;

      // Check if the first item has completely scrolled out of view
      if (marquee.scrollLeft >= marquee.scrollWidth / 2) {
        marquee.scrollLeft = 0; // Reset to the beginning
      }

      // Continue the loop
      animationFrameId = requestAnimationFrame(scrollMarquee);
    };

    // Start the marquee scrolling
    animationFrameId = requestAnimationFrame(scrollMarquee);

    // Cleanup function to stop the animation when the component unmounts
    return () => cancelAnimationFrame(animationFrameId);
  }, [topReviews]);

  const renderSkeletonLoader = (count) => {
    return Array.from({ length: count }).map((_, index) => (
      <div className="item skeleton" key={`skeleton-${index}`}>
        <div className="inner-wrap">
          <div className="top skeleton-bar"></div>
          <div className="center skeleton-bar"></div>
          <div className="bottom skeleton-bar"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="top-reviews">
      <h1 className="title">The Latest Reviews from Students</h1>
      <div className="marquee" ref={marqueeRef}>
        <div className="marquee-content">
          {isLoading
            ? renderSkeletonLoader(6) // Skeleton loading for 6 items
            : [...topReviews, ...topReviews].map((review, index) => ( // Duplicate reviews for infinite scrolling
              <div className="item" key={index}>
                <div className="inner-wrap">
                  <div className="top">
                    <div className="rating-score">
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
                  <div className="center">
                    <div className="review-content">
                      "{review.reviewComment}"
                    </div>
                  </div>
                  <div className="bottom">
                    <div className="user-prof-container">
                      <span className="prof-name">
                        <Link to={`/search/professors/${review.professorID}`}>{`${review.professorName}`}</Link>
                      </span>

                      <br/>
                      <span className="user-name">Reviewed by&nbsp;{review.userName || 'Anonymous'}  </span>


                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TopReviews;
