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
                    <img src= {aboutImg} alt="About Us image"/>
                    <h3>About</h3>
                </div>
                <div className='text-content-wrap'>
                    <p className='text-content'>
                        &emsp;&emsp;{t("Welcome to Polyfica, the go-to platform for honest and transparent professor ratings at Cal Poly SLO. Created by students, for students, we aim to provide you with up-to-date and accurate feedback on your professors to help you make informed decisions when selecting classes.")}
                    </p>
                    <p className='text-content'>
                        &emsp;&emsp;{t("Our mission is simple: empower students to share their experiences and insights, making academic life a little easier for everyone. Whether you're looking for the best instructor for your major or trying to avoid a challenging teaching style, we’ve got you covered with easy-to-use search features and detailed reviews.")}
                    </p>
                    <p className='text-content'>
                        &emsp;&emsp;{t("Join us in building a community of students helping students, and make the most of your academic journey.")}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;
