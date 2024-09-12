import React, { useState, useEffect } from 'react';
import { storage, firestore } from '../../../firebase/utils'; // Ensure this path is correct
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import defaultProfileImage from "../../../assets/defaultProfImage.png";

// add like/dislike button -> add likeCount in the professor document
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
  const [temp, setTemp] = useState("0");
  const [selectedFile, setSelectedFile] = useState(null); // Store selected file
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 840); // Check if screen width is >= 840px

  // Handle window resize events to show/hide the count-wrap based on screen size
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

    const metadata = {
      contentType: selectedFile.type, // Set the content type based on the file
    };

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

        const newPicture = {
          id: Date.now(),
          url: downloadURL,
          likeCount: 0,
        };

        // Update the professor document in Firestore
        const professorRef = doc(firestore, 'professors', professor.id);
        await updateDoc(professorRef, {
          pictures: arrayUnion(newPicture),
        });

        const updatedPictures = [...professorPictures, newPicture];
        setProfessorPictures(updatedPictures);
        updateThumbNail(updatedPictures);
        setUploading(false);
        setSelectedFile(null); // Reset selected file after upload
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
        <div className='profileImage-wrap'>
          {professor.profileImage ? (
            <img src={professor.profileImage} alt={`${professor.firstName} ${professor.lastName}`} />
          ) : (
            <img src={defaultProfileImage} alt="Default Profile" />
          )}
        </div>
      
        <h2 className="profName">
          {professor.firstName} {professor.lastName}
        </h2>
        <p className='profIntro'>
          Professor in the <b>{professor.department}</b>  department at <b>{professor.schoolName}</b>.
        </p>

        <div className="bottom-wrap">
            
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
            <div className="button-wrap">
                <button className="review-button">Review</button>
                <button className="follow-button">Follow</button>
                <button className="like-button">Like</button>
            </div>
        </div>
      </div>

    </div>
  );
};

export default ProfessorDetails;
