import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOutUserStart } from '../../redux/User/user.actions';
import { selectCartItemsCount } from '../../redux/Cart/cart.selectors';
import SignupDropdown from './SignupDropdown';
import ConditionalLink from './ConditionalLink';
import NavItem from './NavItem';
import FormInput from '../forms/FormInput';
import Button from '../forms/Button';
import { TbMenu2, TbX } from "react-icons/tb";
import Logo from '../../assets/poly_ratings_logo.png';
import closeImage from '../../assets/closeImage2.png';
import SideMenuDefaultUserImage from '../../assets/account_circle.png';
import { firestore } from '../../firebase/utils';
import './styles.scss';
import RatingSlider from './RatingSlider';
import { useTranslation } from "react-i18next";

const mapState = (state) => ({
    currentUser: state.user.currentUser,
    totalNumCartItems: selectCartItemsCount(state),
});

const Header = ({ showSignupDropdown, setShowSignupDropdown }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { currentUser, totalNumCartItems } = useSelector(mapState);
    const profileImageUrl = currentUser ? currentUser.userProfileImage : null;
    const profileImageClass = "icon-button" + " " + (profileImageUrl ? "with-profile-picture" : "");
    const myAccountLink = (currentUser && currentUser.userRoles && currentUser.userRoles[0]) === "admin" ? "/admin" : "/dashboard";

    const [mobile, setMobile] = useState(false);
    const [sidebar, setSidebar] = useState(false);
    const [hide, setHide] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [qualityRating, setQualityRating] = useState(null);
    const [difficultyRating, setDifficultyRating] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewCourseName, setReviewCourseName] = useState('');
    const [department, setDepartment] = useState('');
    const [schoolName, setSchoolName] = useState('');

    const refOutsideDiv = useRef(null);
    const dropdownRef = useRef(null);

    const signOut = () => {
        dispatch(signOutUserStart());
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutsideDiv = (e) => {
            if (!e.target.closest('.sidebar')) {
                setSidebar(false);
            }
        }
        if (sidebar) {
            document.addEventListener("click", handleClickOutsideDiv, true);
            document.body.style.overflowY = 'hidden';
        }
        return () => {
            document.removeEventListener('click', handleClickOutsideDiv);
            document.body.style.overflowY = 'visible';
        };
    }, [sidebar]);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowSignupDropdown(false);
          }
        };
    
        if (showSignupDropdown) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [showSignupDropdown]);

    useEffect(() => {
        if (window.innerWidth <= 840) {
            setMobile(true);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 840) {
                setMobile(true);
            } else {
                setMobile(false);
                setSidebar(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const controlNavbar = () => {
        if (typeof window !== 'undefined') {
            if (window.scrollY > 0) {
                setHide(false);
                document.querySelector('header').classList.add('scrolled');
            } else {
                document.querySelector('header').classList.remove('scrolled');
            }
    
            if (window.scrollY < 45 || window.scrollY < lastScrollY) {
                setHide(false);
            } else {
                setHide(true);
            }
            setLastScrollY(window.scrollY);
        }
    };
    
    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);

    const { t } = useTranslation(["header", "common"]);

    const handleWriteReviewClick = () => {
        setShowModal(!showModal);
        if(!showModal){
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (qualityRating === null || difficultyRating === null) {
            alert('Please provide both Quality Rating and Difficulty Rating.');
            return;
        }
        try {
            setIsLoading(true);
            const commentData = {
                difficultyRating: difficultyRating,
                qualityRating: qualityRating,
                reviewComment: reviewComment,
                reviewCourseName: reviewCourseName,
                reviewDates: new Date(),
                likes: 0,
                userLikes: [],
                userDislikes: []
            };
            const newProfessorData = {
                department: department,
                firstName: firstName,
                lastName: lastName,
                schoolName: schoolName,
                commentData: [commentData]
            };
            
            const docRef = await firestore.collection('professors').add(newProfessorData);
            await docRef.update({
                profID: docRef.id
            });
            setShowModal(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error submitting form:', error);
        }
    };

    return (
        <>
            <header className={(hide ? "header hidden" : "header")}>
                <div className="wrap">
                    {mobile &&
                        <div className="sideMenu">
                            <a>{!sidebar ?
                                <TbMenu2 size={28} onClick={() => setSidebar(!sidebar)} color={"black"} strokeWidth={"1"} /> :
                                <TbX size={28} onClick={() => setSidebar(!sidebar)} color={"black"} strokeWidth={"1"} />
                            }
                            </a>
                        </div>
                    }

                    <div className="logo">
                        <Link to="/">
                            <img src={Logo} alt="LOGO" />
                        </Link>
                    </div>

                    {!mobile &&
                        <div className='callToActions'>
                            <ul>
                                {/* logged in */}
                                {currentUser && [
                                    <ConditionalLink 
                                        text={t("Write a Review")} 
                                        link="/login" 
                                        className={`review-btn ${isScrolled ? 'scrolled' : ''}`}
                                        preventLink={true}
                                        handleWriteReviewClick={handleWriteReviewClick} // Pass the function as a prop
                                    />
                                ]}
                                {currentUser && [
                                    <div className="signup-container" ref={dropdownRef}>
                                        <button 
                                            className={`signup-btn ${isScrolled ? 'scrolled' : ''}`}
                                            onClick={() => setShowSignupDropdown(!showSignupDropdown)}>
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>
                                        {showSignupDropdown && <SignupDropdown label="Log Out" link="/" signOut={signOut} />}
                                    </div>
                                ]}

                                {/* not logged in */}
                                {!currentUser && [
                                    <ConditionalLink 
                                        text={t("Write a Review")} 
                                        link="/login" 
                                        className={`review-btn ${isScrolled ? 'scrolled' : ''}`}
                                        navClassName={`nav-item ${isScrolled ? 'scrolled' : ''}`}
                                        preventLink={true}
                                        handleWriteReviewClick={handleWriteReviewClick} // Pass the function as a prop
                                    />
                                ]}
                                {!currentUser && [
                                    <NavItem text={t("Log In")} link="/login" className="login-button" />
                                ]}
                                {!currentUser && [
                                    <div className="signup-container" ref={dropdownRef}>
                                        <button     
                                            className={`signup-btn ${isScrolled ? 'scrolled' : ''}`} 
                                            onClick={() => setShowSignupDropdown(!showSignupDropdown)}>
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>
                                        {showSignupDropdown && <SignupDropdown label="Sign Me Up" link="/registration" class="SignupDropdown"/>}
                                    </div>
                                ]}
                            </ul>
                        </div>
                    }
                </div>

                <div className={sidebar ? "sidebar active" : "sidebar"} ref={refOutsideDiv}>
                    <ul className="sidebar-items">
                        {currentUser && [
                            <div className='row-account'>
                                <NavItem
                                    image={profileImageUrl ? profileImageUrl : SideMenuDefaultUserImage}
                                    profileImageClass={profileImageClass}
                                    mobile={true}
                                    setSidebar={setSidebar} sidebar={sidebar}
                                    link={myAccountLink}
                                >
                                    <span className='row-account-text'>{t("Account")}</span>
                                </NavItem>
                            </div>,
                            <NavItem
                                text={t("Shop")} link="/search"
                                mobile={true}
                                setSidebar={setSidebar} sidebar={sidebar}
                            />,
                            <NavItem
                                setSidebar={setSidebar} sidebar={sidebar} signOut={signOut} logOutButton={true} text={t("Log out")}
                            />,
                        ]}

                        {!currentUser && [
                            <div className='logged-out'>
                                <div className='account'>
                                    <NavItem text={t("Log in")} link="/login" setSidebar={setSidebar} sidebar={sidebar} mobile={true} />
                                    <NavItem text={t("Sign up")} link="/registration" setSidebar={setSidebar} sidebar={sidebar} mobile={true} />
                                </div>
                            </div>
                        ]}
                    </ul>
                </div>
            </header>

            {true && (
                <form onSubmit={handleFormSubmit}>
                    <div className={showModal ? "rev-modal active" : "rev-modal"}>
                        <div className="modal-content">
                            <span className="close-button" onClick={() => setShowModal(false)}>
                                <div className='close-image'>
                                    {/* <closeImage/> */}
                                    &times;
                                </div>
                            </span>
                            <h2>{t("Write a Review")}</h2>
                            <h3>{t("Help Us Understand Your Classroom Experience")}</h3>
                            
                            <div className="form-row">
                                <FormInput 
                                    type="text"
                                    name="firstName"
                                    value={firstName}
                                    onChange={e => setFirstName(e.target.value)}
                                    label={t("First Name")}
                                    required
                                />
                                <FormInput 
                                    type="text"
                                    name="lastName"
                                    value={lastName}
                                    onChange={e => setLastName(e.target.value)}
                                    label={t("Last Name")}
                                    required
                                />
                            </div>
                            <FormInput 
                                type="text"
                                name="reviewCourseName"
                                value={reviewCourseName}
                                onChange={e => setReviewCourseName(e.target.value)}
                                label={t("Course Name")}
                                required
                            />
                            <FormInput 
                                type="text"
                                name="schoolName"
                                value={schoolName}
                                onChange={e => setSchoolName(e.target.value)}
                                label={t("School Name")}
                                required
                            />
                            <FormInput 
                                type="text"
                                name="department"
                                value={department}
                                onChange={e => setDepartment(e.target.value)}
                                label={t("Department")}
                                required
                            />

                            <FormInput 
                                type="text"
                                name="reviewComment"
                                value={reviewComment}
                                onChange={e => setReviewComment(e.target.value)}
                                label={t("Review Comment")}
                                className="reviewComment"
                                required
                            />
                            
                            <div className='column-wrap'>
                                <div className="form-row rating-sliders">
                                    <div className="slider-label">Quality</div>
                                    <RatingSlider
                                        onChange={(value) => setQualityRating(value)}  // Correctly handle the value
                                        required
                                    />
                                </div>
                                <div className="form-row rating-sliders">
                                    <div className="slider-label">Difficulty</div>
                                    <RatingSlider
                                        onChange={(value) => setDifficultyRating(value)}  // Correctly handle the value
                                        required
                                    />
                                </div>
                            </div>
                                         
                            <div className="terms">
                                By clicking the "Submit" button, I acknowledge that I have read and agreed to the
                                <span>{t(" ")}</span>
                                <Link to="/terms">
                                    {t("Terms of Service")}
                                </Link>
                                <span>{t(" and ")}</span>
                                <Link to="/privacy">
                                    {t("Privacy Policy")}
                                </Link>
                                <span>{t(".")}</span>
                            </div>
                            <Button type="submit" className={isLoading ? "btn btn-submit isLoading" : "btn btn-submit"} disabled={isLoading} isLoading={isLoading}>
                                {t("Submit")}
                            </Button>
                                                    
                            {/* <div className="cancel" onClick={() => setShowModal(false)}>
                                <h3>
                                    <Link to="/">
                                        {t("common:Cancel")}
                                    </Link>
                                </h3>
                            </div> */}
                        </div>
                    </div>
                </form>
            )}

        </>
    );
};

Header.defaultProps = {
    currentUser: null
}

export default Header;
