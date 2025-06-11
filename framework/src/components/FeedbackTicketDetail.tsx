import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FeedbackDetailData } from "../interface/feedback/FeedbackDetailData";
import { getFeedbackDetail } from "../controller/feedback/FeedbackTicketDetail";
import { createReply } from "../controller/feedback/Reply";
import { getCurrentUser } from "../utils/Auth";
import UserAvatar from "./UserAvatar";
import '../css/FeedbackTicketDetail.css'

const FeedbackTicketDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [feedback, setFeedback] = useState<FeedbackDetailData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [replyTitle, setReplyTitle] = useState<string>('');
    const [replyContent, setReplyContent] = useState<string>('');
    const [submittingReply, setSubmittingReply] = useState<boolean>(false);

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

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!replyTitle.trim() || !replyContent.trim()) {
            alert('Please fill in both title and content for the reply.');
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) {
            alert('You must be logged in to reply.');
            return;
        }

        if (!feedback) return;

        setSubmittingReply(true);

        try {
            const replyData = {
                titleReply: replyTitle,
                reviewReply: replyContent,
                fk_reply_idFeedback: feedback.idfeedback,
                fk_reply_idUser: parseInt(currentUser.id)
            };

            const newReply = await createReply(replyData);
            
            if (newReply) {
                // Refresh the feedback data to show the new reply
                const updatedFeedback = await getFeedbackDetail(id!);
                if (updatedFeedback) {
                    setFeedback(updatedFeedback);
                }
                
                // Reset form
                setReplyTitle('');
                setReplyContent('');
                setShowReplyForm(false);
                setError(null);
            } else {
                setError('Failed to submit reply. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
            setError('Failed to submit reply. Please try again.');
        } finally {
            setSubmittingReply(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!feedback) return <div className="error">Feedback not found</div>;

    // Determine if current user can reply
    const currentUser = getCurrentUser();
    const canReply = currentUser && (
        // User can reply to their own feedback
        parseInt(currentUser.id) === feedback.fk_feedback_iduser ||
        // Company users can reply to feedback about their company
        (currentUser.companyId && currentUser.companyId === feedback.fk_feedback_idcompany)
    );

    return (
        <div className="feedback-detail-container">
            <div className="feedback-data">
                <div className="feedback-header">
                    <UserAvatar 
                        pictureUrl={feedback.pictureuser} 
                        email={feedback.emailuser} 
                        size="lg" 
                    />
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
                    <i className="fa-solid fa-building fa-lg"></i>
                    <span>{feedback.namecompany || "Company"}</span>
                </div>
                <div className="replies-section">
                    {feedback.replies && feedback.replies.length > 0 ? (
                        feedback.replies.map((reply) => (
                            <div key={reply.idreply} className="reply-item">
                                <div className="reply-header">
                                    <div className="reply-author">
                                        <UserAvatar 
                                            pictureUrl={reply.pictureuser} 
                                            email={reply.emailuser} 
                                            size="sm" 
                                        />
                                        <span>{reply.emailuser || reply.namecompany || "Unknown"}</span>
                                    </div>
                                    <h4 className="reply-title">{reply.titlereply}</h4>
                                </div>
                                <div className="reply-content">
                                    {reply.reviewreply}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-replies">
                            <p>No response from company yet.</p>
                        </div>
                    )}
                </div>
                
                {/* Reply Form - Only show if user can reply */}
                {canReply && (
                    <div className="reply-form-section">
                        {!showReplyForm ? (
                            <button 
                                className="add-reply-btn"
                                onClick={() => setShowReplyForm(true)}
                            >
                                Add Reply
                            </button>
                        ) : (
                            <form onSubmit={handleReplySubmit} className="reply-form">
                                <h3>Add a Reply</h3>
                                <div className="form-group">
                                    <label htmlFor="replyTitle">Reply Title:</label>
                                    <input
                                        type="text"
                                        id="replyTitle"
                                        value={replyTitle}
                                        onChange={(e) => setReplyTitle(e.target.value)}
                                        placeholder="Enter reply title..."
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="replyContent">Reply Content:</label>
                                    <textarea
                                        id="replyContent"
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Enter your reply..."
                                        rows={4}
                                        required
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setShowReplyForm(false);
                                            setReplyTitle('');
                                            setReplyContent('');
                                        }}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={submittingReply}
                                        className="submit-btn"
                                    >
                                        {submittingReply ? 'Submitting...' : 'Submit Reply'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackTicketDetail;