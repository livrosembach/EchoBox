import React from "react";
import '../css/Home.css';
import { FeedbackData } from "../interface/feedback/FeedbackData";


const FeedbackTicket: React.FC<FeedbackData> = ({idfeedback, titlefeedback, reviewfeedback, typecategory, typestatus}) => {   

    return (
        <div className="feedback">
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