import { StatusData } from "../../interface/feedback/StatusData";

export const getStatus = async (statusData: StatusData): Promise<StatusData | null> => {
    try {
        const response = await fetch("http://localhost:3003/feedback/status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(statusData),
        });

        if (!response.ok) {
            console.error("Failed to create status:", await response.text());
            return null;
        }

        const data: StatusData = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating status:", error);
        return null;
    }
};