// DropdownItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss'


const DropDownItem = ({ label, link, onClick, isLogout }) => {
    return (
        <Link to={link} className={`dropdown-item ${isLogout ? 'logout' : ''}`} onClick={onClick}>
            {label}
        </Link>
    );
};

export default DropDownItem;