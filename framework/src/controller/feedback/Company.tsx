import { CompanyData } from "../../interface/user/CompanyData";

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

export const createCompany = async (companyData: Omit<CompanyData, 'idcompany'>): Promise<CompanyData | null> => {
    try {
        const response = await fetch("http://localhost:3003/company", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nameCompany: companyData.namecompany,
                emailCompany: companyData.emailcompany,
                cnpjCompany: companyData.cnpjcompany
            }),
        });

        if (!response.ok) {
            console.error("Failed to create company:", await response.text());
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating company:", error);
        return null;
    }
};

export const updateCompany = async (id: number, companyData: Omit<CompanyData, 'idcompany'>): Promise<CompanyData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/company/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nameCompany: companyData.namecompany,
                emailCompany: companyData.emailcompany,
                cnpjCompany: companyData.cnpjcompany
            }),
        });

        if (!response.ok) {
            console.error("Failed to update company:", await response.text());
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating company:", error);
        return null;
    }
};

export const deleteCompany = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:3003/company/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to delete company:", await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error deleting company:", error);
        return false;
    }
};