import { CategoryData } from "../../interface/feedback/CategoryData";

export const getCategory = async (): Promise<CategoryData[]> => {
    try {
        const response = await fetch("http://localhost:3003/category", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch categories:", await response.text());
            return [];
        }

        const data: CategoryData[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

