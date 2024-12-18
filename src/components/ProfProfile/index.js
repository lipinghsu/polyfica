import React, { useEffect, useState } from 'react';
import { firestore, auth } from "../../firebase/utils";
import { useParams, useHistory } from 'react-router-dom';
import './ProfProfile.scss';
import CommentItem from './CommentItem';
import ProfessorDetails from './ProfessorDetails';
import thinkingStan from '../../assets/thinking-stan2.png'

const ProfProfile = () => {
    const { profID } = useParams();
    const history = useHistory();
    const [professor, setProfessor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState(null)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
      
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });
        return () => unsubscribe();
    }, []);

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

    const handleSubComment = async (commentIndex) => {
        if (!currentUser) {
            history.push('/login');
            return;
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
        return (
            <div className="skeleton-loader">
                <div className="skeleton-header"></div>
                <div className="skeleton-body">
                    <div className="skeleton-line name"></div>
                    <div className="skeleton-line detail"></div>
                    <div className="skeleton-line count"></div>
                    <div className="skeleton-line rev-btn"></div>
                </div>
                <div className="skeleton-body">
                    <div className="skeleton-line content"></div>
                    <div className="skeleton-line content"></div>
                    <div className="skeleton-line content"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="profProfile">
            {professor && <ProfessorDetails professor={professor} />}
            <div className="profComments">
                {professor && professor.commentData && professor.commentData.length > 0 ? (
                    professor.commentData.map((comment, index) => (
                        <CommentItem
                            key={index}
                            comment={comment}
                            currentUser={currentUser}
                            handleLike={handleLike}
                            handleDislike={handleDislike}
                            handleSubComment= {handleSubComment}
                            index={index}
                        />
                    ))
                ) : (
                <div className="no-comments">
                    <div className='image-wrap'>
                        <img src={thinkingStan} />
                    </div>
                    <div className='text-wrap'>
                        <div className='no-commnets-title'>Be the first to review</div>
                        <div className='no-commnets-text a'>Nobody's reviewed this professor yet.</div>
                        <div className='no-commnets-text b'>Share your experience and help others find the right professor.</div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default ProfProfile;
