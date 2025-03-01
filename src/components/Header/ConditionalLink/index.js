import React from 'react';
import { Link } from 'react-router-dom';

const ConditionalLink = (props) => {
    const handleClick = (e) => {
        if (props.preventLink) {
            e.preventDefault();
            props.handleWriteReviewClick();
        }
    };

    return (
        <Link to={props.link} onClick={handleClick} className= {props.navClassName}>
            {props.reviewButton ? 
            <span className="material-symbols-outlined">
                edit_square
            </span>
            :
            null
            }
            <span className={props.link ? ("text-button " + props.className) : "text-button"}>
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
