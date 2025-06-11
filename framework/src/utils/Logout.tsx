import { dispatchAuthStateChange } from "./Auth";

export const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Dispatch auth state change event
    dispatchAuthStateChange();
    
    window.location.href = '/login';
};