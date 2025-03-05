import React, { useEffect, useState } from 'react';
import { firestore, auth } from "../../firebase/utils";
import { Link, useParams, useHistory } from 'react-router-dom';

import './ProfProfile.scss';
import CommentItem from './CommentItem';
import ProfessorDetails from './ProfessorDetails';
import thinkingStan from '../../assets/thinking-stan2.png';
import Button from '../forms/Button';
import homeIcon from '../../assets/bs-icon.png';
import { useTranslation } from "react-i18next";
import SidebarItem from './SideBarItem';

const ProfProfile = () => {
    const { profID } = useParams();
    const history = useHistory();
    const [professor, setProfessor] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1100);
    const [isMediumScreen, setIsMediumScreen] = useState(window.innerWidth > 840);

    const { t } = useTranslation(["", "common"]);

    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth > 1100);
            setIsMediumScreen(window.innerWidth > 840);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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

    useEffect(() => {
        if (profID) {
            fetchProfessor();
        }
    }, [profID]);


    return (
        <div className="content-wrap">
            
            {isMediumScreen && (
                <div className="sidebar-left">
                    <SidebarItem icon={homeIcon} label={"Home"} link="/"/>
                    {/* <SidebarItem icon={homeIcon} label={"Professor List"} link="/"/> */}
                </div>
            )}

            {isLoading ? 
            (<div className="skeleton-loader">
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
            )
            : 
            (<div className="profProfile">
                {professor && <ProfessorDetails professor={professor} />}
                <div className="profComments">
                    {professor?.commentData?.length > 0 ? (
                        professor.commentData.map((comment, index) => (
                            <CommentItem
                                key={index}
                                comment={comment}
                                currentUser={currentUser}
                                index={index}
                            />
                        ))
                    ) : (
                    <div className="no-comments">
                        <div className='image-wrap'>
                            <img src={thinkingStan} />
                        </div>
                        <div className='text-wrap'>
                            <div className='no-comments-title'>Be the first to review</div>
                            <div className='no-comments-text a'>Nobody's reviewed this professor yet.</div>
                            <div className='no-comments-text b'>Share your experience and help others find the right professor.</div>
                        </div>
                    </div>
                    )}
                </div>
            </div>)
            }

            {isWideScreen && (
            <div className="sidebar-right">
                <div className="mt-md">
                    <div className="title">New to Pölyfica?</div>
                    <div className="subtitle">
                        Create your account and find the best professors at Cal Poly.
                    </div>
                    <Button type="submit" className="btn btn-submit btn-google">Continue with Google</Button>
                    <Button type="submit" className="btn btn-submit">Continue with Amazon</Button>
                    <Button type="submit" className="btn btn-submit">Continue with Facebook</Button>
                    <div className="sub-terms">
                        By continuing, you agree to the 
                        <span>{t(" ")}</span>
                            <Link to="/terms">
                                {t("Terms of Service")}
                            </Link>
                        <span>{t(" ")}</span>
                        and acknowledge that you accept our 
                        <span>{t(" ")}</span>
                        <Link to="/terms">
                                {t("Private Policy")}
                        </Link>
                        .
                    </div>
                </div>
                {/* Rating Distribution */}
                {/* Top rated professors in the same department */}
                {/* Similar Professors */}
            </div>
            )}
        </div>
    );
};

export default ProfProfile;