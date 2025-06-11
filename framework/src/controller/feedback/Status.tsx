import { StatusData } from "../../interface/feedback/StatusData";

export const getStatus = async (): Promise<StatusData[]> => {
    try {
        const response = await fetch("http://localhost:3003/status", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch Statuses:", await response.text());
            return [];
        }

        const data: StatusData[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching Statuses:", error);
        return [];
    }
};

