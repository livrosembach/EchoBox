import React from "react";
import '../css/Home.css';
import { FeedbackData } from "../interface/feedback/FeedbackData";


const FeedbackTicket: React.FC<FeedbackData> = ({idfeedback, titlefeedback, reviewfeedback, fk_feedback_idcategory, fk_feedback_idstatus}) => {   

    return (
        <div className="feedback">
            <h2 className="feedback-title"><i className="fa-solid fa-envelope"></i> {titlefeedback}</h2>
            <div className="feedback-tags">
                <span className="tag entertainment">{fk_feedback_idcategory}</span>
                <span className="tag answered">{fk_feedback_idstatus}</span>
            </div>
            <p className="feedback-description">
                {reviewfeedback}
            </p>
        </div>
    );
};

export default FeedbackTicket;