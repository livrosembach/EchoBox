export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    } catch (error) {
        console.error('Error getting current user from localStorage:', error);
        return null;
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const isUserLoggedIn = () => {
    const user = getCurrentUser();
    const token = getAuthToken();
    return user && token;
};

// Custom event to notify components about auth state changes
export const AUTH_STATE_CHANGED = 'authStateChanged';

export const dispatchAuthStateChange = () => {
    window.dispatchEvent(new Event(AUTH_STATE_CHANGED));
};
