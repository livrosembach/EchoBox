import { CategoryData } from "../../interface/feedback/CategoryData";

export const getCategory = async (statusData: CategoryData): Promise<CategoryData | null> => {
    try {
        const response = await fetch("http://localhost:3003/feedback/category", {
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

        const data: CategoryData = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating status:", error);
        return null;
    }
};