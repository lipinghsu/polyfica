// DropdownItem.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss'
import aboutIcon from '../../../../assets/aboutIcon.png'


const DropDownItem = ({ label, link, onClick, isLogout, icon, className}) => {
    return (
    <div className='dropdown-item'>
        <div className='icon-wrap'>
            <img src={icon} className={className}/>
        </div>
        <Link to={link} className={`dropdown-ite ${isLogout ? 'logout' : ''}`} onClick={onClick}>
            {label}
        </Link>
    </div>

    );
};

export default DropDownItem;