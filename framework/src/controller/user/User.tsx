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

        const rawData = await response.json();
        
        // Transform the data to match our interface
        const data: UserData[] = rawData.map((user: any) => ({
            idUser: user.iduser,
            emailUser: user.emailuser,
            passwordUser: '', // Don't expose passwords
            fk_user_idCompany: user.fk_user_idcompany,
            nameCompany: user.namecompany
        }));
        
        return data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const createUser = async (userData: {
    emailUser: string;
    passwordUser: string;
    fk_user_idCompany?: number;
}): Promise<UserData | null> => {
    try {
        const response = await fetch("http://localhost:3003/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            console.error("Failed to create user:", await response.text());
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating user:", error);
        return null;
    }
};

export const updateUser = async (id: number, userData: {
    emailUser: string;
    passwordUser?: string;
    fk_user_idCompany?: number;
}): Promise<UserData | null> => {
    try {
        const response = await fetch(`http://localhost:3003/user/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            console.error("Failed to update user:", await response.text());
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating user:", error);
        return null;
    }
};

export const deleteUser = async (id: number): Promise<boolean> => {
    try {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`http://localhost:3003/user/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token && { "Authorization": `Bearer ${token}` })
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to delete user:", errorData.message || await response.text());
            
            // Show user-friendly error message for self-deletion attempt
            if (response.status === 403) {
                alert(errorData.message || "Você não pode deletar sua própria conta");
            }
            
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
};