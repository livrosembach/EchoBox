import { FeedbackData } from "../../interface/feedback/FeedbackData";


export const sendFeedback = async (FeedbackData: FeedbackData): Promise<FeedbackData | null> => {
    try {
        const response = await fetch("http://localhost:3003/feedback/send_feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(FeedbackData),
        });

        if (!response.ok) {
            console.error("Failed to register user:", await response.text());
            return null;
        }

        const data: FeedbackData = await response.json();
        return data;
    } catch (error) {
        console.error("Error sending feedback:", error);
        return null;
    }
};