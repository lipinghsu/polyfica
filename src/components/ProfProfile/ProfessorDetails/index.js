import React, { useState, useEffect } from 'react';
import { storage, firestore } from '../../../firebase/utils';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import defaultProfileImage from "../../../assets/defaultProfImage.png";
import likeIcon from '../../../assets/like_icon.png';

// Add like/dislike button -> add likeCount in the professor document
function calculateAverageQualityRating(commentData) {
  if (!commentData || commentData.length === 0) {
    return 0;
  }
  const totalQualityRating = commentData.reduce((acc, comment) => acc + (comment.qualityRating || 0), 0);
  return (totalQualityRating / commentData.length).toFixed(1);
}

const ProfessorDetails = ({ professor }) => {
  const [professorPictures, setProfessorPictures] = useState(professor.pictures || []);
  const [thumbNail, setThumbNail] = useState(professor.thumbNail || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 840);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 840);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    const metadata = { contentType: selectedFile.type };
    const storageRef = ref(storage, `professors/${professor.id}/${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile, metadata);
    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
      },
      (error) => {
        console.error('Upload failed:', error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newPicture = { id: Date.now(), url: downloadURL, likeCount: 0 };

        const professorRef = doc(firestore, 'professors', professor.id);
        await updateDoc(professorRef, {
          pictures: arrayUnion(newPicture),
        });

        const updatedPictures = [...professorPictures, newPicture];
        setProfessorPictures(updatedPictures);
        updateThumbNail(updatedPictures);
        setUploading(false);
        setSelectedFile(null);
      }
    );
  };

  const handleLike = async (id) => {
    const updatedPictures = professorPictures.map((picture) => {
      if (picture.id === id) {
        return { ...picture, likeCount: picture.likeCount + 1 };
      }
      return picture;
    });

    const professorRef = doc(firestore, 'professors', professor.id);
    await updateDoc(professorRef, {
      pictures: updatedPictures,
    });

    setProfessorPictures(updatedPictures);
    updateThumbNail(updatedPictures);
  };

  const updateThumbNail = (pictures) => {
    const mostLiked = pictures.reduce(
      (max, picture) => (picture.likeCount > max.likeCount ? picture : max),
      pictures[0]
    );
    setThumbNail(mostLiked);
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

          {true ? (
            <div className="count-wrap">
              <div className="review-count">
                <span className="number">{professor.commentData?.length || 0}</span>{" "}
                <span className="count-text">{professor.commentData?.length > 1 ? "reviews" : "review"}</span>
              </div>
              <div className="follower-count">
                <span className="number">0</span> <span className="count-text">follower</span>
              </div>
              <div className="like-count">
                <span className="number">0</span> <span className="count-text">like</span>
              </div>
            </div>
          ) : null}

          <div className="button-wrap">
            {!isLargeScreen ? 
            <button className="review-button">Review</button>
            : null}
            <button className="follow-button">Follow</button>
            <button className="like-button">
              Like
            </button>
            
          </div>

        </div>

        {isLargeScreen ? 
          <button className="review-button">Write a Review</button>
        : null}
      </div>
    </div>
  );
};

export default ProfessorDetails;
