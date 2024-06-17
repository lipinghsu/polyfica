import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { firestore } from '../../../firebase/utils';
import FormInput from '../../forms/FormInput';
import Button from '../../forms/Button';
import '../styles.scss';

import { useTranslation } from "react-i18next";

const WriteReviewModal = ({ showModal, setShowModal }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation(["header", "common"]);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [qualityRating, setQualityRating] = useState(null);
    const [difficultyRating, setDifficultyRating] = useState(null);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewCourseName, setReviewCourseName] = useState('');
    const [department, setDepartment] = useState('');
    const [schoolName, setSchoolName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (qualityRating === null || difficultyRating === null) {
            alert('Please provide both Quality Rating and Difficulty Rating.');
            return;
        }
        try {
            setIsLoading(true);
            const commentData = {
                difficultyRating: difficultyRating,
                qualityRating: qualityRating,
                reviewComment: reviewComment,
                reviewCourseName: reviewCourseName,
                reviewDates: new Date(),
                likes: 0,
                userLikes: [],
                userDislikes: []
            };
            const newProfessorData = {
                department: department,
                firstName: firstName,
                lastName: lastName,
                schoolName: schoolName,
                commentData: [commentData]
            };
            
            const docRef = await firestore.collection('professors').add(newProfessorData);
            await docRef.update({
                profID: docRef.id
            });
            setShowModal(false);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error submitting form:', error);
        }
    };

    return (
        showModal && (
            <div className="modal active">
                <div className="modal-content">
                    <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
                    <h4>{t("Write a Review")}</h4>
                    
                    <form onSubmit={handleFormSubmit}>
                        <div className="formRow">
                            <FormInput 
                                type="text"
                                name="firstName"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                label={t("First Name")}
                                required
                            />
                            <FormInput 
                                type="text"
                                name="lastName"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                label={t("Last Name")}
                                required
                            />
                        </div>

                        <div className="formRow">
                            <FormInput 
                                type="number"
                                name="qualityRating"
                                value={qualityRating}
                                onChange={e => setQualityRating(e.target.value)}
                                label={t("Quality Rating")}
                                required
                            />
                            <FormInput 
                                type="number"
                                name="difficultyRating"
                                value={difficultyRating}
                                onChange={e => setDifficultyRating(e.target.value)}
                                label={t("Difficulty Rating")}
                                required
                            />
                        </div>
                        
                        <FormInput 
                            type="text"
                            name="reviewCourseName"
                            value={reviewCourseName}
                            onChange={e => setReviewCourseName(e.target.value)}
                            label={t("Course Name")}
                            required
                        />

                        <FormInput 
                            type="text"
                            name="department"
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            label={t("Department")}
                            required
                        />

                        <FormInput 
                            type="text"
                            name="schoolName"
                            value={schoolName}
                            onChange={e => setSchoolName(e.target.value)}
                            label={t("School Name")}
                            required
                        />
                        <FormInput 
                            type="text"
                            name="reviewComment"
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                            label={t("Review Comment")}
                            className="reviewComment"
                            required
                        />

                        <Button type="submit" className={isLoading ? "btn btn-submit isLoading" : "btn btn-submit"} disabled={isLoading} isLoading={isLoading}>
                            {t("Submit")}
                        </Button>
                    </form>
                </div>
            </div>
        )
    );
};

export default WriteReviewModal;
