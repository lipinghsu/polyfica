import React, { useState } from 'react';
import { storage, firestore } from '../../../firebase/utils'; // Ensure this path is correct
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import defaultProfileImage from "../../../assets/defaultProfImage.png"
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
        setTemp("01");
        

        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setTemp("1");
        setProgress(progressPercent);
        setTemp("2");
        console.log(`Upload is ${progressPercent}% done`);
        setTemp(`Upload is ${progressPercent}% done`);
        switch (snapshot.state) {
          case 'paused':
            setTemp("Upload is paused");
            console.log('Upload is paused');
            break;
          case 'running':
            setTemp("Upload is running");
            console.log('Upload is running');
            break;
        }
        setTemp("end of upload");
      },
      (error) => {
        console.error('Upload failed:', error);
        // Handle different errors
        switch (error.code) {
          case 'storage/unauthorized':
            console.error('User doesn\'t have permission to access the object');
            break;
          case 'storage/canceled':
            console.error('User canceled the upload');
            break;
          case 'storage/unknown':
            console.error('Unknown error occurred:', error.serverResponse);
            break;
          default:
            console.error('An error occurred during upload');
        }
        setUploading(false);
      },
      async () => {
        setTemp("async1");
        // Upload completed successfully, now get the download URL
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);

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
        {/* {temp} */}
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
        <p>
          Professor in the {professor.department} department at {professor.schoolName}.
        </p>
      </div>

      {/* {thumbNail && (
        <div className="thumbnail">
          <img src={thumbNail.url} alt="Professor Thumbnail" />
        </div>
      )} */}

      {/* <input type="file" accept="image/*" onChange={handleFileSelect} /> */}

      {/* Show upload button only if a file is selected */}
      {/* {selectedFile && (
        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      )} */}
{/* 
      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }} />
          </div>
          <p>{progress.toFixed(2)}%</p>
        </div>
      )} */}

      <div className="pictureGallery">
        {professorPictures.map((picture) => (
          <div key={picture.id} className="pictureItem">
            <img src={picture.url} alt="Professor" className="profPicture" />
            <button onClick={() => handleLike(picture.id)}>Like</button>
            <span>Likes: {picture.likeCount}</span>
          </div>
        ))}
      </div>

      {professor.commentData ? (
        <div className="averageRating">
          <div className="progressBar">
            <div
              className="progress"
              style={{
                width: `${(calculateAverageQualityRating(professor.commentData) / 5) * 100}%`,
                backgroundColor: `hsl(${
                  (calculateAverageQualityRating(professor.commentData) / 5) * 120
                }, 100%, 50%)`,
              }}
            />
          </div>
          <p>Overall Quality Based on {professor.commentData.length} Ratings</p>
        </div>
      ) : (
        <p>Overall Quality Based on 0 ratings</p>
      )}
    </div>
  );
};

export default ProfessorDetails;
