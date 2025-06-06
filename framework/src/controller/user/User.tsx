import { UserData } from "../../interface/user/UserData";

export const getUsers = async (): Promise<UserData[]> => {
    try {
        const response = await fetch("http://localhost:3003/user", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch users:", await response.text());
            return [];
        }

        const data: UserData[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};