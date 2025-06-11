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

export const createStatus = async (statusData: Omit<StatusData, 'idstatus'>): Promise<StatusData | null> => {
    try {
        const response = await fetch("http://localhost:3003/status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                typeStatus: statusData.typestatus,
                colorStatus: statusData.colorstatus
            }),
        });

        if (!response.ok) {
            console.error("Failed to create status:", await response.text());
            return null;
        }

        const data = await response.json();
        return {
            idstatus: data.idStatus || data.idstatus,
            typestatus: data.typeStatus || data.typestatus,
            colorstatus: data.colorStatus || data.colorstatus
        };
    } catch (error) {
        console.error("Error creating status:", error);
        return null;
    }
};

export const updateStatus = async (id: number, statusData: Omit<StatusData, 'idstatus'>): Promise<StatusData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/status/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                typeStatus: statusData.typestatus,
                colorStatus: statusData.colorstatus
            }),
        });

        if (!response.ok) {
            console.error("Failed to update status:", await response.text());
            return null;
        }

        const data = await response.json();
        return {
            idstatus: data.idStatus || data.idstatus || id,
            typestatus: data.typeStatus || data.typestatus,
            colorstatus: data.colorStatus || data.colorstatus
        };
    } catch (error) {
        console.error("Error updating status:", error);
        return null;
    }
};

export const deleteStatus = async (id: number): Promise<boolean> => {
    try {
        const response = await fetch(`http://localhost:3003/status/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to delete status:", await response.text());
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error deleting status:", error);
        return false;
    }
};

