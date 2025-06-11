import { ReplyData } from "../../interface/feedback/ReplyData";

export const getRepliesForFeedback = async (feedbackId: string): Promise<ReplyData[]> => {
    try {
        const response = await fetch(`http://localhost:3003/replies/feedback/${feedbackId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch replies:", await response.text());
            return [];
        }

        const data: ReplyData[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching replies:", error);
        return [];
    }
};

export const createReply = async (replyData: {
    titleReply: string;
    reviewReply: string;
    fk_reply_idFeedback: number;
    fk_reply_idUser: number;
}): Promise<ReplyData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/replies`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(replyData),
        });

        if (!response.ok) {
            console.error("Failed to create reply:", await response.text());
            return null;
        }

        const data: ReplyData = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating reply:", error);
        return null;
    }
};
