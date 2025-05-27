import { FeedbackData } from "../../interface/feedback/FeedbackData";

export const getFeedbackDetail = async (id: string): Promise<FeedbackData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/feedback/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch feedback detail:", await response.text());
            return null;
        }

        const data: FeedbackData = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching feedback detail:", error);
        return null;
    }
};