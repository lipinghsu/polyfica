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
import SideMenuDefaultUserImage from '../../assets/account_circle.png';
import { firestore } from '../../firebase/utils';
import './styles.scss';
import RatingSlider from './RatingSlider';
import { useTranslation } from "react-i18next";

const mapState = (state) => ({
    currentUser: state.user.currentUser,
    totalNumCartItems: selectCartItemsCount(state),
});

const Header = ({ showSignupDropdown, setShowSignupDropdown, homepageHeader }) => {
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
    const [difficultyRating, setDifficultyRating] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewCourseName, setReviewCourseName] = useState('');
    const [department, setDepartment] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [isFormComplete, setIsFormComplete] = useState(false);

    const refOutsideDiv = useRef(null);
    const dropdownRef = useRef(null);

    const [isValid, setIsValid] = useState(true);
  
    const handleCourseNameChange = (e) => {
      const value = e.target.value;
      const courseNameRegex = /^[A-Za-z]+\s\d+$/;
  
      // Validate the input against the regex pattern
      setIsValid(courseNameRegex.test(value));
      setReviewCourseName(value);
    };

    const signOut = () => {
        dispatch(signOutUserStart());
    }

     useEffect(() => {
        const isComplete = firstName.trim() && lastName.trim() && schoolName.trim() && department.trim() && reviewCourseName.trim() && reviewComment.trim() && difficultyRating !== null;
        setIsFormComplete(isComplete);
    }, [firstName, lastName, schoolName, department, reviewCourseName, reviewComment, difficultyRating]);

    // Disable window scrolling if sidebar or modal is active
    useEffect(() => {
        if (sidebar && showModal) {
            document.body.style.overflow = 'hidden';
        }
        else if (sidebar || showModal) {
            document.body.style.overflow = 'hidden';
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } 
        else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebar, showModal]);

    // Detect scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Hide sidebar if user clicks outside of the div
    useEffect(() => {
        const handleClickOutsideDiv = (e) => {
            if (!e.target.closest('.sidebar')) {
                setSidebar(false);
            }
        }
        if (sidebar) {
            document.addEventListener("click", handleClickOutsideDiv, true);
        }
        return () => {
            document.removeEventListener('click', handleClickOutsideDiv);
        };
    }, [sidebar]);

    // Hide dropdown menu if user clicks outside of the div
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

    // Detect window size -> mobile mode
    useEffect(() => {
        if (window.innerWidth <= 840) {
            setMobile(true);
        }
    }, []);

    // Detect window size -> desktop mode
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

    // Dismiss modal on Esc key press
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) {  // 27 is the keycode for the Esc key
                setShowModal(false);
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
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

    const clearForm = () => {
        setFirstName('');
        setLastName('');
        setSchoolName('');
        setDepartment('');
        setReviewCourseName('');
        setReviewComment('');
        setDifficultyRating(null);
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
        if (!showModal) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!isFormComplete) {
            return; 
        }

        if (difficultyRating === null) {
            alert('Please give this professor a rating value.');
            return;
        }
        try {
            setIsLoading(true);
            const commentData = {
                difficultyRating: difficultyRating,
                reviewComment: reviewComment,
                reviewCourseName: reviewCourseName,
                reviewDates: new Date(),
                likes: 0,
                userLikes: [],
                userDislikes: []
            };
            const newProfessorData = {
                department: department.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                schoolName: schoolName.trim(),
                commentData: [commentData],
                likeCount: 0,
                follower: [],
                profileImage: ""
            };
            
            // search database 
            // -> if prof exist (name, school, department all match) 
            // -> update comment filed
            const docRef = await firestore.collection('professors').add(newProfessorData);
            await docRef.update({
                profID: docRef.id
            });
            setShowModal(false);
            setIsLoading(false);
        } 
        catch (error) {
            setIsLoading(false);
            console.error('Error submitting form:', error);
        }
    };

    return (
        <>
        {/* <header className={`${sidebar ? "sidebar-active" : ""}`}> */}
            <header className={`${hide ? "header hidden" : "header"} ${sidebar ? "sidebar-active" : ""}`}>
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
                                        className={`review-btn ${isScrolled ? 'scrolled' : ''} ${homepageHeader ? ' homepage' : ''}`}
                                        navClassName={`nav-item ${isScrolled ? 'scrolled' : ''} ${homepageHeader ? ' homepage' : ''}`}
                                        preventLink={true}
                                        reviewButton={true}
                                        handleWriteReviewClick={handleWriteReviewClick} // Pass the function as a prop
                                    />
                                ]}
                                {!currentUser && [
                                    <NavItem text={t("Log In")} link="/login" className="login-button" mobile={false}/>
                                ]}
                                {!currentUser && [
                                    <div className="signup-container" ref={dropdownRef}>
                                        <button     
                                            className={`signup-btn ${isScrolled ? 'scrolled' : ''} ${homepageHeader ? ' homepage' : ''}`}
                                            onClick={() => setShowSignupDropdown(!showSignupDropdown)}>
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>
                                        <SignupDropdown 
                                            
                                            class="SignupDropdown"
                                            showSignupDropdown = {showSignupDropdown}
                                        />
                                    </div>
                                ]}
                            </ul>
                        </div>
                    }
                </div>

                {/*  */}
                <div className= {sidebar ? "sidebar active" : "sidebar"} ref={refOutsideDiv}>
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
                                setSidebar={setSidebar} 
                                sidebar={sidebar} 
                                signOut={signOut} 
                                logOutButton={true} 
                                text={t("Log out")}
                            />,
                        ]}

                        {/* mobile, not logged in */}
                        {/* side menu needs to be dismissed */}
                        {!currentUser && [
                            <div className='logged-out'>
                                <div className='account'>
                                {/* <NavItem text={t("About")} link="/about" setSidebar={setSidebar} sidebar={sidebar} mobile={true} /> */}
                                    <NavItem text={t("Log In")} link="/login" setSidebar={setSidebar} sidebar={sidebar} mobile={true} />
                                    <NavItem text={t("Sign Up")} link="/registration" setSidebar={setSidebar} sidebar={sidebar} mobile={true} />
                                </div>
                                <div className='row-review' onClick={handleWriteReviewClick}>
                                    <ConditionalLink 
                                        text={t("Write a Review")} 
                                        link="/login" 
                                        className={`review-btn ${isScrolled ? 'scrolled' : ''}`}
                                        preventLink={true}
                                        handleWriteReviewClick={handleWriteReviewClick}
                                    />
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
                            <span className="close-button" 
                                onClick={() => {
                                    setShowModal(false); 
                                    clearForm();}}
                            >
                                <div className='close-image'>
                                    {/* <closeImage/> */}
                                    &times;
                                </div>
                            </span>
                            <h2>{t("Write a Review")}</h2>
                            <h3>{t("Help us understand your class experience")}</h3>
                            
                            <div className="form-row name">
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
                                name="schoolName"
                                value={schoolName}
                                onChange={e => setSchoolName(e.target.value)}
                                label={t("Name of School")}
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
                                name="reviewCourseName"
                                value={reviewCourseName}
                                onChange={handleCourseNameChange}
                                label="Course Code"
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
                            
                            <div className='column-wrap rev-modal-rating'>
                                <div className="form-row rating-sliders">
                                    {/* <div className="slider-label">Rating</div> */}
                                    <RatingSlider
                                          value={difficultyRating}
                                          onChange={(value) => setDifficultyRating(value)} 
                                        required
                                        className="rev-modal-rating"
                                    />
                                </div>
                            </div>
                                         
                            <div className="terms">
                                By submitting this review, you agree to our
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
                            
                            <Button
                                type="submit"
                                className={`${isLoading ? "btn btn-submit isLoading" : "btn btn-submit"} ${!isFormComplete ? "inactive" : ""}`}
                                disabled={isLoading || !isFormComplete}
                                isLoading={isLoading}
                            >
                                {t("Submit Review")}
                            </Button>
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