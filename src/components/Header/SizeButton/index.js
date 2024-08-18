import React, {useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import './styles.scss';

let sizeOptions = [{id: 1, value:'1'}, {id: 2, value:'2'}, {id: 3, value: '3'}, {id:4, value:'4'}, {id:5, value:'5'}];

export default function SizeButton({onChange}){
    const [current, setCurrent] = useState(sizeOptions[0].id);
    // const dispatch = useDispatch();
    function handleSelectedButton(size){
        onChange(size)
        setCurrent(size.id);
    }
    
    return <div className="button-group-container">
        {sizeOptions.map((sizeOptions, index) => {
            const reactButton = "button" + " " +(current === sizeOptions.id ? "active" : "")
            return (
                <div className="button-container" key={index} onClick={() => handleSelectedButton(sizeOptions)}>
                    <div className={reactButton} >
                        {sizeOptions.value}
                    </div>
                </div>
            );
        })}
    </div>
}  