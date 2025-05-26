import { SendFeedbackData } from "../../interface/feedback/SendFeedbackData";

export const sendFeedback = async (feedbackData: SendFeedbackData): Promise<boolean> => {
    try {
        const result = await fetch("http://localhost:3003/send_feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(feedbackData),
        });

        if (!result.ok) {
            console.error("Failed to send feedback:", await result.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error sending feedback:", error);
        return false;
    }
};