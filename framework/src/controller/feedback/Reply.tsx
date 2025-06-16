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
            return [];
        }

        const data: ReplyData[] = await response.json();
        return data;
    } catch (error) {
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
            return null;
        }

        const data: ReplyData = await response.json();
        return data;
    } catch (error) {
        return null;
    }
};
