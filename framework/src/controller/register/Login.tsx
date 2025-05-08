import { UserData } from "../../interface/register/UserData";

export const loginUser = async (userData: UserData): Promise<UserData | null> => {
    try {
        const response = await fetch("http://localhost:3003/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            console.error("Failed to log in user:", await response.text());
            return null;
        }

        const data: UserData = await response.json();
        return data;
    } catch (error) {
        console.error("Error logging in user:", error);
        return null;
    }
};