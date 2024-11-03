import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from "react-i18next";
import horseImage from './../../assets/horsie2.jpg';
import einsteinImage from './../../assets/einstein.jpg';
import buildingImage from './../../assets/dexter_building.jpg';
import beeImage from './../../assets/beekeeping.jpg';
import pauseImage from './../../assets/pause.png';
import playImage from './../../assets/play.png';
import nextArrow from './../../assets/nextArrow.png';
import prevArrow from './../../assets/prevArrow.png';
import './styles.scss';

const About = () => {
    const { t } = useTranslation(["about"]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const slides = [
        <div className="image-container" key="image">
            <img src={horseImage} alt="Image of a Horse" />
            <div className="text-wrap">
            <span>{t("Gallop through your Cal Poly journey with confidence and clarity")}</span>
            </div>
        </div>,
        <div className="image-container" key="slide1">
            <img src={beeImage} alt="Image of beekeeping" />
            <div className="text-wrap">
                <span>{t("Reliable, student-driven reviews")}</span>
                <span>{t("Transform how Cal Poly students choose their professors")}</span>
            </div>
        </div>,
        <div className="image-container" key="slide2">
            <img src={einsteinImage} alt="Image of Einstein" />
            <div className="text-wrap">
                <span>{t("Brilliant, valuable, and insightful")}</span>
                <span>{t("Better than any other professor rating site at Cal Poly")}</span>
            </div>
        </div>,
        <div className="image-container" key="slide3">
            <img src={buildingImage} alt="Image of Dexter building" />
            <div className="text-wrap">
                <span>{t("Discover professors who genuinely inspire you")}</span>
                <span>{t("Find the one that makes your Cal Poly experience unforgettable")}</span>
            </div>
        </div>,

    ];

    const timeoutRef = useRef(null);
    const progressRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (progressRef.current) clearInterval(progressRef.current);
    };

    useEffect(() => {
        resetTimeout();
        if (!isPaused) {
            progressRef.current = setInterval(() => {
                setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
            }, 50);

            timeoutRef.current = setTimeout(() => {
                setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
                setProgress(0);
            }, 5000); // auto-slide every 5 seconds
        }
        return () => resetTimeout();
    }, [currentSlide, isPaused]);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        setProgress(0);
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
        setProgress(0);
    };

    const togglePause = () => {
        setIsPaused((prev) => !prev);
        if (isPaused) setProgress(0);
    };

    return (
        <section className='about'>
            <div className='about-wrap'>
                <div className='slideshow'>
                    <div className="slide" style={{ transform: `translateX(${-currentSlide * 100}%)` }}>
                        {slides.map((slide, index) => (
                            <div className="slide-content" key={index}>
                                {slide}
                            </div>
                        ))}
                    </div>
                    {/* <button className="prev-button" onClick={prevSlide}>❮</button>
                    <button className="next-button" onClick={nextSlide}>❯</button> */}
                </div>
                <div className="progress-section">
                    <div className='button-wrap'>
                        <button className="prev-button" onClick={prevSlide}>
                            <img src={prevArrow}/>
                        </button>
                        <button className="toggle-button" onClick={togglePause}>
                            {isPaused ? 
                                <img src = {playImage}/> : 
                                <img src = {pauseImage}/>}
                        </button>
                        <button className="next-button" onClick={nextSlide}>
                            <img src={nextArrow}/>
                        </button>

                    </div>
                    <div className="progress-bar">
                            <div className="progress" style={{ width: `${progress}%` }}></div>
                        </div>

                </div>

            </div>
        </section>
    );
};

export default About;
