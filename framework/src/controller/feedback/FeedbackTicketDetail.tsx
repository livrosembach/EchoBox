import { FeedbackDetailData } from "../../interface/feedback/FeedbackDetailData";
import { getRepliesForFeedback } from "./Reply";

export const getFeedbackDetail = async (id: string): Promise<FeedbackDetailData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/feedback/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return null;
        }

        const feedbackData: FeedbackDetailData = await response.json();
        
        // Fetch replies for this feedback
        const replies = await getRepliesForFeedback(id);
        feedbackData.replies = replies;
        
        return feedbackData;
    } catch (error) {
        return null;
    }
};