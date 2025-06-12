import { FeedbackData } from "../../interface/feedback/FeedbackData";
import { FeedbackDetailData } from "../../interface/feedback/FeedbackDetailData";
import { SendFeedbackData } from "../../interface/feedback/SendFeedbackData";
import { UpdateFeedbackData } from "../../interface/feedback/UpdateFeedbackData";

export const getFeedbacks = async (filters?: {
    search?: string;
    category?: string;
    status?: string;
    company?: string;
}): Promise<FeedbackData[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (filters?.search) queryParams.append('search', filters.search);
        if (filters?.category && filters.category !== 'all-categories') queryParams.append('category', filters.category);
        if (filters?.status && filters.status !== 'all-status') queryParams.append('status', filters.status);
        if (filters?.company && filters.company !== 'all-companies') queryParams.append('company', filters.company);

        const response = await fetch(`http://localhost:3003/feedback?${queryParams.toString()}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch feedbacks:", await response.text());
            return [];
        }

        const data: FeedbackData[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
    }
};

export const getFeedbackById = async (id: number): Promise<FeedbackDetailData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/feedback/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch feedback:", await response.text());
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return null;
    }
};

export const createFeedback = async (feedbackData: SendFeedbackData): Promise<FeedbackData | null> => {
    try {
        const response = await fetch("http://localhost:3003/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
            console.error("Failed to create feedback:", await response.text());
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating feedback:", error);
        return null;
    }
};

export const updateFeedback = async (id: number, feedbackData: UpdateFeedbackData): Promise<FeedbackData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/feedback/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(feedbackData),
        });

        if (!response.ok) {
            console.error("Failed to update feedback:", await response.text());
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating feedback:", error);
        return null;
    }
};

export const updateFeedbackStatus = async (id: number, statusId: number): Promise<boolean> => {
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:3003/feedback/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
            body: JSON.stringify({ fk_feedback_idStatus: statusId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to update feedback status:", errorData.message || await response.text());
            
            // Show user-friendly error message
            if (response.status === 403) {
                alert(errorData.message || "Você não tem permissão para alterar o status deste feedback");
            } else if (response.status === 401) {
                alert("Você precisa estar logado para alterar o status");
            }
            
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error updating feedback status:", error);
        return false;
    }
};

export const deleteFeedback = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:3003/feedback/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to delete feedback:", await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return false;
    }
};
