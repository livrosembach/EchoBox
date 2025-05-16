import { CompanyData } from "../../interface/register/CompanyData";

export const getCompanies = async (): Promise<CompanyData[]> => {
    try {
        const response = await fetch("http://localhost:3003/company", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch companies:", await response.text());
            return [];
        }

        const data: CompanyData[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching companies:", error);
        return [];
    }
};