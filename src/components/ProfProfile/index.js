import React, { useEffect, useState } from 'react';
import { firestore, auth } from "../../firebase/utils";
import { useParams, useHistory } from 'react-router-dom';
import './ProfProfile.scss';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import ProfessorDetails from './ProfessorDetails';

function calculateAverageQualityRating(commentData) {
    if (!commentData || commentData.length === 0) {
        return 0;
    }
    const totalQualityRating = commentData.reduce((acc, comment) => acc + (comment.qualityRating || 0), 0);
    return (totalQualityRating / commentData.length).toFixed(1);
}

const ProfProfile = () => {
    const { profID } = useParams();
    const history = useHistory();
    const [professor, setProfessor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [qualityRating, setQualityRating] = useState(0);
    const [difficultyRating, setDifficultyRating] = useState(0);
    const [courseCode, setCourseCode] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const [isFormExpanded, setIsFormExpanded] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
      
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleCommentChange = (event) => {
        setNewComment(event.target.value);
    };

    const handleQualityRating = (rating) => {
        setQualityRating(rating);
    };

    const handleDifficultyRating = (rating) => {
        setDifficultyRating(rating);
    };

    const handleCourseCodeChange = (event) => {
        setCourseCode(event.target.value);
    };

    const handleFormExpand = () => {
        setIsFormExpanded(true);
    };

    const handleFormCollapse = () => {
        setIsFormExpanded(false);
        setNewComment('');
        setQualityRating(0);
        setDifficultyRating(0);
        setCourseCode('');
    };

    const handleFormClick = (event) => {
        event.stopPropagation();
        setIsFormExpanded(true);
    };

    async function updateCommentData(professorID, commentData, additionalData) {
        try {
            const userRef = firestore.doc(`professors/${professorID}`);
            const snapshot = await userRef.get();

            if (snapshot.exists) {
                let targetProfessor = snapshot.data();
                let profCommentData = targetProfessor.commentData || [];
                profCommentData.push(commentData);
                const updates = {
                    commentData: profCommentData,
                    ...additionalData
                };
                await userRef.update(updates);
            } else {
                const newProfessorData = {
                    department: "Test",
                    firstName: "John",
                    lastName: "Doe",
                    profID: professorID,
                    schoolName: "California Polytechnic State University",
                    commentData: [commentData],
                    ...additionalData
                };
                await userRef.set(newProfessorData);
            }
        } catch (error) {
            console.error('Error updating commentData:', error);
        }
    }

    const handleProfessorUpload = async (event) => {
        event.preventDefault();
        if (qualityRating === 0 || difficultyRating === 0) {
            alert('Please provide both Quality Rating and Difficulty Rating.');
            return;
        }
        try {
            setIsLoading(true);
            const commentData = {
                difficultyRating: difficultyRating,
                qualityRating: qualityRating,
                reviewComment: newComment,
                reviewCourseName: courseCode,
                reviewDates: new Date(),
                likes: 0,
                userLikes: [],
                userDislikes: []
            }
            await updateCommentData(professor.profID, commentData);
            handleFormCollapse();
            setIsLoading(false);
            fetchProfessor();
        } catch (error) {
            setIsLoading(false);
        }
    };

    const fetchProfessor = async () => {
        try {
            const professorRef = firestore.collection("professors").doc(profID);
            const doc = await professorRef.get();
            if (doc.exists) {
                setProfessor(doc.data());
            } else {
                console.log("No such professor with ID:", profID);
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching professor:", error);
            setIsLoading(false);
        }
    };

    const handleLike = async (commentIndex) => {
        if (!currentUser) {
            history.push('/login');
            return;
        }

        const updatedComments = [...professor.commentData];
        const comment = updatedComments[commentIndex];

        if (!comment.userLikes) comment.userLikes = [];
        if (!comment.userDislikes) comment.userDislikes = [];

        if (comment.userLikes.includes(currentUser.uid)) {
            // User has already liked, so remove their like
            comment.userLikes = comment.userLikes.filter(uid => uid !== currentUser.uid);
            comment.likes--;
        } else {
            // User is liking the comment
            if (comment.userDislikes.includes(currentUser.uid)) {
                comment.userDislikes = comment.userDislikes.filter(uid => uid !== currentUser.uid);
                comment.likes++;
            }
            comment.userLikes.push(currentUser.uid);
            comment.likes++;
        }

        await firestore.doc(`professors/${professor.profID}`).update({ commentData: updatedComments });
        setProfessor({ ...professor, commentData: updatedComments });
    };

    const handleDislike = async (commentIndex) => {
        if (!currentUser) {
            history.push('/login');
            return;
        }

        const updatedComments = [...professor.commentData];
        const comment = updatedComments[commentIndex];

        if (!comment.userLikes) comment.userLikes = [];
        if (!comment.userDislikes) comment.userDislikes = [];

        if (comment.userDislikes.includes(currentUser.uid)) {
            // User has already disliked, so remove their dislike
            comment.userDislikes = comment.userDislikes.filter(uid => uid !== currentUser.uid);
            comment.likes++;
        } else {
            // User is disliking the comment
            if (comment.userLikes.includes(currentUser.uid)) {
                comment.userLikes = comment.userLikes.filter(uid => uid !== currentUser.uid);
                comment.likes--;
            }
            comment.userDislikes.push(currentUser.uid);
            comment.likes--;
        }

        await firestore.doc(`professors/${professor.profID}`).update({ commentData: updatedComments });
        setProfessor({ ...professor, commentData: updatedComments });
    };

    useEffect(() => {
        if (profID) {
            fetchProfessor();
        }
    }, [profID]);

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="profProfile" onClick={handleFormCollapse}>
            {professor && <ProfessorDetails professor={professor} />}
            <CommentForm
                isFormExpanded={isFormExpanded}
                newComment={newComment}
                handleCommentChange={handleCommentChange}
                qualityRating={qualityRating}
                handleQualityRating={handleQualityRating}
                difficultyRating={difficultyRating}
                handleDifficultyRating={handleDifficultyRating}
                courseCode={courseCode}
                handleCourseCodeChange={handleCourseCodeChange}
                handleProfessorUpload={handleProfessorUpload}
                handleFormClick={handleFormClick}
                handleFormCollapse={handleFormCollapse}
            />
            
            <div className="profComments">
                {professor && professor.commentData && professor.commentData.length > 0 ? (
                    professor.commentData.map((comment, index) => (
                        <CommentItem
                            key={index}
                            comment={comment}
                            currentUser={currentUser}
                            handleLike={handleLike}
                            handleDislike={handleDislike}
                            index={index}
                        />
                    ))
                ) : (
                    <p>No review comments available for this professor.</p>
                )}
            </div>
        </div>
    );
};

export default ProfProfile;
