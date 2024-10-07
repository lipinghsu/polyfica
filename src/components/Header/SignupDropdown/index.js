// SignupDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropdownItem from './DropDownItem';
import './SignupDropdown.scss';
import aboutIcon from './../../../assets/aboutIcon.png'
import signUpIcon from './../../../assets/signUpIcon.png'
import addProfIcon from './../../../assets/addProfIcon2.png'
const SignupDropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false);


    const handleClick = () => {
        if (props.label === "Log Out" && props.signOut) {
            props.signOut();
        }
    };

    return (
        <div className="signup-dropdown">
            <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                {props.label === "Log Out" ?
                    <Link to="/" className="dropdown-item" onClick={""}>
                        Settings
                    </Link> 
                    : 
                    null
                }
                <DropdownItem 
                    label={"About"} 
                    link={props.link} 
                    onClick={handleClick} 
                    isLogout={props.label === "Log Out"} 
                    icon = {aboutIcon}
                    className="about"
                />
                <DropdownItem 
                    label={"Sign Me Up"} 
                    link={props.link} 
                    onClick={handleClick} 
                    isLogout={props.label === "Log Out"} 
                    icon={signUpIcon}
                    className="sign-up"
                />

                <DropdownItem 
                    label={"Add a Professor"} 
                    link={props.link} 
                    onClick={handleClick} 
                    isLogout={props.label === "Log Out"} 
                    icon={addProfIcon}
                    className="add-prof"
                />


            </div>
        </div>
    );
};

export default SignupDropdown;
