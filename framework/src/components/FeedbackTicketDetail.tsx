import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FeedbackData } from "../interface/feedback/FeedbackData";
import { getFeedbackDetail } from "../controller/feedback/FeedbackTicketDetail";
import '../css/FeedbackTicketDetail.css'

const FeedbackTicketDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [feedback, setFeedback] = useState<FeedbackData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedbackDetail = async () => {
            if (!id) {
                setError("No feedback ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getFeedbackDetail(id);
                
                if (data) {
                    setFeedback(data);
                    setError(null);
                } else {
                    setError("Failed to load feedback details");
                }
            } catch (error) {
                console.error("Error fetching feedback details:", error);
                setError("Failed to load feedback details");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbackDetail();
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!feedback) return <div className="error">Feedback not found</div>;

    return (
        <div className="feedback-detail-container">
            <div className="feedback-data">
                <div className="feedback-header">
                    <i className="fa-solid fa-circle-user fa-lg"></i>
                    <span>{feedback.emailuser || "Username"}</span>
                </div>
                <div className="title">
                    <div className="title-text">
                        <p>{feedback.titlefeedback}</p>
                    </div>
                    <div className="category-status">
                        <span className="tag" style={{ backgroundColor: feedback.colorcategory || '#CCCCCC' }}>{feedback.typecategory}</span>
                        <span className="tag" style={{ backgroundColor: feedback.colorstatus || '#007bff' }}>{feedback.typestatus}</span>
                    </div>
                </div>
                <div className="description">
                    {feedback.reviewfeedback}
                </div>
            </div>
            <div id="company-answer" className="feedback-data company-answer">
                <div className="feedback-header">
                    <i className="fa-solid fa-circle-user fa-lg"></i>
                    <span>{feedback.namecompany || "Empresa"}</span>
                </div>
                <div className="description">
                    {/* This would be filled with company response data when available */}
                    No response from company yet.
                </div>
            </div>
        </div>
    );
};

export default FeedbackTicketDetail;