import React, { useEffect, useState } from 'react';
import { firestore, auth } from "../../firebase/utils";
import { useParams, useHistory } from 'react-router-dom';
import './ProfProfile.scss';
import CommentItem from './CommentItem';
import ProfessorDetails from './ProfessorDetails';
import thinkingStan from '../../assets/thinking-stan2.png'
import Button from '../forms/Button';
import homeIcon from  '../../assets/bs-icon.png'

const ProfProfile = () => {
    const { profID } = useParams();
    const history = useHistory();
    const [professor, setProfessor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormComplete, setIsFormComplete] = useState(false);
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
        <div className="content-wrap">
            <div className="empty-div-left">
                <div className='list-item-wrap'>
                    <div className='img-wrap'>
                        <img src={homeIcon} />
                    </div>
                    <div className='text-wrap'>
                        Home
                    </div>
                </div>

                
            </div>
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
            <div className="empty-div-right">
                <div className="mt-md">
                    <div className="title">
                        New to Pölyfica?
                    </div>
                    <div className="subtitle">
                        Create your account and find the best professors at Cal Poly.
                    </div>
                        <Button
                                type="submit"
                                className={`${isLoading ? "btn btn-submit isLoading" : "btn btn-submit"}}`}
                                disabled={isLoading || !isFormComplete}
                                isLoading={isLoading}
                            >
                                Continue with Google
                        </Button>
                        <Button
                                type="submit"
                                className={`${isLoading ? "btn btn-submit isLoading" : "btn btn-submit"}}`}
                                disabled={isLoading || !isFormComplete}
                                isLoading={isLoading}
                            >
                                Continue with Amazon
                        </Button>
                        <Button
                                type="submit"
                                className={`${isLoading ? "btn btn-submit isLoading" : "btn btn-submit"}}`}
                                disabled={isLoading || !isFormComplete}
                                isLoading={isLoading}
                            >
                                Continue with Facebook
                        </Button>
                    <div className="sub-terms">
                        By continuing, you agree to our Terms of Service and acknowledge that you accept the Privacy Policy.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfProfile;
