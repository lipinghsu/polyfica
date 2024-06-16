import React from 'react';
import { Link } from 'react-router-dom';
// import './styles.scss'; // Ensure this imports the necessary styles

const ConditionalLink = (props) => {
    const handleClick = (e) => {
        if (props.preventLink) {
            e.preventDefault(); // Prevents the default link behavior
            props.handleWriteReviewClick(); // Call the function passed via props
        }
    };

    return (
        <Link to={props.link} onClick={handleClick} className="nav-item">
            {props.className === "review-btn" ? 
            <span className="material-symbols-outlined">
                edit_square
            </span>
            :
            null
            }
            <span className={props.link ? "text-button " + props.className : "text-button"}>
                {props.text}
                {/* cart item number */}
                {props.number !== 0 && props.number &&
                    <span> ({props.number})</span>
                }
            </span>
        </Link>
    );
};

export default ConditionalLink;
