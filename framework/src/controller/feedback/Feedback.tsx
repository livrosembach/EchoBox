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
        
        // Make sure the status ID is an integer
        const statusIdInt = parseInt(statusId.toString(), 10);
        
        if (isNaN(statusIdInt)) {
            console.error("Invalid status ID:", statusId);
            throw new Error("Invalid status ID");
        }
        
        // Check if token exists
        if (!token) {
            console.error("No auth token found");
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                title: 'Autenticação Necessária',
                text: 'Você precisa estar logado para alterar o status',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
            return false;
        }
        
        const response = await fetch(`http://localhost:3003/feedback/${id}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ fk_feedback_idStatus: statusIdInt }),
        });

        // Try to get response body for better error handling
        let responseText;
        try {
            responseText = await response.text();
        } catch (e) {
            console.error("Error reading response:", e);
        }
        
        if (!response.ok) {
            let errorMessage = "Erro ao atualizar o status. Por favor, tente novamente.";
            
            try {
                const errorData = JSON.parse(responseText || '{}');
                if (response.status === 403) {
                    errorMessage = errorData.message || "Você não tem permissão para alterar o status deste feedback";
                } else if (response.status === 401) {
                    errorMessage = "Você precisa estar logado para alterar o status";
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch (jsonError) {
                console.error("Error parsing JSON response:", jsonError);
            }
            
            // Use SweetAlert for error message
            const Swal = (await import('sweetalert2')).default;
            Swal.fire({
                title: 'Erro',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
            
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error updating feedback status:", error);
        
        // Use SweetAlert for error message
        const Swal = (await import('sweetalert2')).default;
        Swal.fire({
            title: 'Erro',
            text: 'Ocorreu um erro ao atualizar o status. Por favor, tente novamente.',
            icon: 'error',
            confirmButtonText: 'Ok',
            confirmButtonColor: '#1575C5'
        });
        
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
