// SignupDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DropdownItem from './DropDownItem';
import './SignupDropdown.scss';

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
                />
                <DropdownItem 
                    label={"Sign Me Up"} 
                    link={props.link} 
                    onClick={handleClick} 
                    isLogout={props.label === "Log Out"} 
                />

                <DropdownItem 
                    label={"Add a Professor"} 
                    link={props.link} 
                    onClick={handleClick} 
                    isLogout={props.label === "Log Out"} 
                />


            </div>
        </div>
    );
};

export default SignupDropdown;
