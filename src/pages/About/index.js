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
import ProgressBar from '../../components/ProgressBar';
import './styles.scss';
const About = () => {
    const { t } = useTranslation(["about"]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const SLIDE_DURATION = 5000; // Total duration per slide in ms
    const INTERVAL_STEP = 10; // Interval step in ms for smoother updates

    const slides = [
        <div className="image-container" key="slide1">
            <img src={horseImage} alt="Image of a Horse" />
            <div className="text-wrap">
                <div className="heading">{t("Reliable, student-driven reviews")}</div>
                <div className="heading-text">{t("Transform the way Cal Poly students choose their professors")}</div>
            </div>
        </div>,
        <div className="image-container" key="slide2">
            <img src={einsteinImage} alt="Image of Einstein" />
            <div className="text-wrap">
                <div className="heading">{t("Brilliant, valuable, and insightful")}</div>
                <div className="heading-text">{t("More trusted than any other professor rating site at Cal Poly")}</div>
            </div>
        </div>,
        <div className="image-container" key="slide3">
            <img src={buildingImage} alt="Image of Dexter building" />
            <div className="text-wrap">
                <div className="heading">{t("Discover professors who genuinely inspire you")}</div>
                <div className="heading-text">{t("Find the one that makes your Cal Poly experience unforgettable")}</div>
            </div>
        </div>,
    ];

    const timerRef = useRef(null);

    const resetTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const startTimer = (remainingTime) => {
        const remainingProgress = 100 - progress;
        const progressIncrement = (remainingProgress / remainingTime) * INTERVAL_STEP;

        timerRef.current = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + progressIncrement;
                if (newProgress >= 100) {
                    resetTimer();
                    setProgress(0); // Reset progress to 0 for the new slide
                    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length); // Move to the next slide
                    return 0;
                }
                return newProgress;
            });
        }, INTERVAL_STEP);
    };

    useEffect(() => {
        resetTimer();
        if (!isPaused) {
            const remainingTime = SLIDE_DURATION * ((100 - progress) / 100);
            startTimer(remainingTime);
        }
        return () => resetTimer();
    }, [currentSlide, isPaused, progress]);

    const nextSlide = () => {
        setProgress(0); // Reset progress when manually moving to the next slide
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    };

    const prevSlide = () => {
        setProgress(0); // Reset progress when manually moving to the previous slide
        setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
    };

    const togglePause = () => {
        setIsPaused((prev) => !prev);
    };

    const handleProgressChange = (newProgress) => {
        setProgress(newProgress);
        resetTimer(); // Stop the current timer and intervals
        const remainingTime = SLIDE_DURATION * ((100 - newProgress) / 100);
        startTimer(remainingTime); // Restart the timer with the adjusted remaining time
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
                </div>
                <div className="progress-section">
                    {/* <div className='button-wrap'>
                        <button className="prev-button" onClick={prevSlide}>
                            <img src={prevArrow} alt="Previous Slide" />
                        </button>
                        <button className="toggle-button" onClick={togglePause}>
                            {isPaused ? <img src={playImage} alt="Play" /> : <img src={pauseImage} alt="Pause" />}
                        </button>
                        <button className="next-button" onClick={nextSlide}>
                            <img src={nextArrow} alt="Next Slide" />
                        </button>
                    </div> */}
                    
                    {/* Use ProgressBar component here with handleProgressChange to control progress */}
                    <ProgressBar progress={progress} setProgress={handleProgressChange} />
                </div>
            </div>
        </section>
    );
};

export default About;