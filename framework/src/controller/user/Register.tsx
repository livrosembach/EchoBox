import { UserData } from "../../interface/user/UserData";

export const registerUser = async (userData: UserData): Promise<UserData | null> => {
    try {
        const response = await fetch("http://localhost:3003/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            console.error("Failed to register user:", await response.text());
            return null;
        }

        const data: UserData = await response.json();
        return data;
    } catch (error) {
        console.error("Error registering user:", error);
        return null;
    }
};