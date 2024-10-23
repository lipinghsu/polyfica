import React, { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import aboutImg from './../../assets/horsie2.jpg'
import './styles.scss';


const About = props => {
    const { t } = useTranslation(["about"]);

    useEffect(() => {
        window.scrollTo(0, 0);
    },[])

    return (
        <section className='about'>
            <div className='about-wrap'>
                <div className="image-container">
                    <img src= {aboutImg} alt="About Us Image"/>
                    <h3 className='text-in-img'>About</h3>
                </div>
                <div className='text-content-wrap'>
                    <p className='text-content'>
                        &emsp;&emsp;{t("At Polyfica, we are revolutionizing the way students at Cal Poly SLO choose their professors. Our platform is designed to help students make informed decisions by providing reliable, student-driven reviews of professors.")}
                    </p>
                    <p className='text-content'>
                        &emsp;&emsp;{t("Whether you're aiming to find the best professor for a specific class, avoid a teaching style that doesn't work for you, or simply discover which instructors can elevate your learning experience, our goal is to make your academic journey smoother, more fulfilling, and more enjoyable.")}
                    </p>
                    <p className='text-content'>
                        &emsp;&emsp;{t("With a user-friendly interface and continuously updated content, we ensure that you have the most accurate and relevant information at your fingertips. Join our community of students helping students, and make the most of your academic journey.")}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
