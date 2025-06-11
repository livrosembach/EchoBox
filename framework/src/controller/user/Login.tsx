import { UserData } from "../../interface/user/UserData";
import { LoginResponse } from "../../interface/user/LoginResponse";
import { dispatchAuthStateChange } from "../../utils/Auth";

export const loginUser = async (userData: UserData): Promise<LoginResponse | null> => {
    try {
        const response = await fetch("http://localhost:3003/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.error("User not found");
            } else if (response.status === 401) {
                console.error("Invalid password");
            }
            return null;
        }

        const data: LoginResponse = await response.json();
        
        // Store auth data
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Dispatch auth state change event
        dispatchAuthStateChange();
        
        console.log(data.token)
        console.log(data.user)
        return data;
    } catch (error) {
        console.error("Error logging in user:", error);
        return null;
    }
};