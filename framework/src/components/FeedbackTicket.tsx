import React from "react";
import '../css/Home.css';
import { FeedbackData } from "../interface/feedback/FeedbackData";
import { useNavigate } from "react-router-dom";

const FeedbackTicket: React.FC<FeedbackData> = ({ idfeedback, titlefeedback, reviewfeedback, typecategory, colorcategory, typestatus, colorstatus}) => {   
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/feedback/${idfeedback}`);
    };

    // Truncate long feedback text for better UI
    const truncatedReview = reviewfeedback && reviewfeedback.length > 250 
        ? `${reviewfeedback.substring(0, 250)}...` 
        : reviewfeedback;

    return (
        <div className="feedback" onClick={handleClick}>
            <h2 className="feedback-title"><i className="fa-solid fa-envelope"></i> {titlefeedback}</h2>
            <div className="feedback-tags">
                {typecategory && <span className="tag" style={{ backgroundColor: colorcategory || '#CCCCCC' }}>{typecategory}</span>}
                {typestatus && <span className="tag" style={{ backgroundColor: colorstatus || '#007bff' }}>{typestatus}</span>}
            </div>
            <p className="feedback-description">
                {truncatedReview}
            </p>
        </div>
    );
};

export default FeedbackTicket;