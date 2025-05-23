import React from "react";
import '../css/Home.css';
import { FeedbackData } from "../interface/feedback/FeedbackData";
import { useNavigate } from "react-router-dom";

const FeedbackTicket: React.FC<FeedbackData> = ({ idfeedback, titlefeedback, reviewfeedback, typecategory, typestatus}) => {   
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/feedback_detail/${idfeedback}`);
    };

    return (
        <div className="feedback" onClick={handleClick}>
            <h2 className="feedback-title"><i className="fa-solid fa-envelope"></i> {titlefeedback}</h2>
            <div className="feedback-tags">
                <span className="tag entertainment">{typecategory}</span>
                <span className="tag answered">{typestatus}</span>
            </div>
            <p className="feedback-description">
                {reviewfeedback}
            </p>
        </div>
    );
};

export default FeedbackTicket;