import React, {useEffect, useState, useRef} from 'react';
import { Link } from 'react-router-dom';
import Button from '../forms/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";
import googleIcon from  "../../assets/icons8-google-96.png"
import amazonIcon from  "../../assets/icons8-amazon-color.png"
import facebookIcon from  "../../assets/Facebook_Logo_Primary.png"
import {googleSignInStart} from "../../redux/User/user.actions";


const RightSideBar = () => {
    const { t } = useTranslation(["", "common"]);
    const [stop, setStop] = useState(false);
    const boxRightRef = useRef();
    const movingDivRef = useRef();
    const dispatch = useDispatch();

    const handleGoogleSignIn = () => {
        dispatch(
            googleSignInStart()
        );
    }
    const controlMovingDiv = () => {
        const boxRightBottomY = (boxRightRef.current?.offsetHeight + boxRightRef.current?.offsetTop);
        if (typeof window !== 'undefined') { 
            setStop((window.scrollY + 72 > (boxRightBottomY - movingDivRef.current?.offsetHeight)));
        }
    }

    // detect scroll
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener("scroll", controlMovingDiv);
          // cleanup function
            return () => {
                window.removeEventListener('scroll', controlMovingDiv);
            };
        }
    }, []);


    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId: "profh-2298e", // Replace with your App ID
                cookie: true,
                xfbml: true,
                version: "v14.0"
            });
        };
    }, []);

    const handleFacebookLogin = () => {
        window.FB.login(response => {
            if (response.authResponse) {
                console.log("Facebook Login Success:", response);
                // Send response.authResponse.accessToken to backend for verification
            } else {
                console.error("User canceled login or did not authorize.");
            }
        }, { scope: "public_profile,email" });
    };


    return (

        <div className="sidebar-right" ref={boxRightRef}>
                
            <div className="mt-md" ref={movingDivRef}
            style={ 
                stop ? {
                    position: 'sticky',
                    top: (boxRightRef.current?.offsetHeight + boxRightRef.current?.offsetTop - movingDivRef.current?.offsetHeight)
                } :{
                    position: 'sticky',
                    top: 72  //x
                }
            }>
                <div className="title">New to Pölyfica?</div>
                <div className="subtitle">
                    Create your account and find the best professors at Cal Poly.
                </div>
                <Button 
                    type="submit" 
                    className="btn btn-submit btn-google" 
                    onClick={handleGoogleSignIn}>
                        
                    <img src={googleIcon} alt="Google Icon"/>
                    Continue with Google
                </Button>

                <Button type="submit" className="btn btn-submit">
                    <img src={amazonIcon} alt="Amazon Icon"/>
                    Continue with Amazon
                </Button>

                <Button type="submit" className="btn btn-submit" onClick={handleFacebookLogin}>
                    <img src={facebookIcon} alt="Facebook Icon"/>
                    Continue with Facebook
                </Button>
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
            {/* <div className="legal-links"
                ref={movingDivRef} 
                style={ 
                    stop ? {
                        position: 'sticky',
                        top: (boxRightRef.current?.offsetHeight + boxRightRef.current?.offsetTop - movingDivRef.current?.offsetHeight)
                    } :{
                        position: 'sticky',
                        top: 360   //x
                    }
                }
            >
                <div className='top-line'>
                    Private Policy
                </div>
                <div className='bot-line'>
                    Cal Poly SLO © 2025. All Rights Reserved. 
                </div>
            </div> */}
        </div>

        
    );
};

export default RightSideBar