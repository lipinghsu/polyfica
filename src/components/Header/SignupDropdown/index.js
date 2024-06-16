// SignupDropdown.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignupDropdown.scss';

const SignupDropdown = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

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
                <Link to={props.link} className="dropdown-item" onClick={handleClick}>
                    {props.label}
                </Link>
                


            </div>
        </div>
    );
};

export default SignupDropdown;
