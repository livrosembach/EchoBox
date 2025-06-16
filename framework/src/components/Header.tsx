import React, { useState, useEffect } from "react";
import logo from '../assets/logo.svg';
import '../css/Header.css';
import { logout } from "../utils/Logout";
import { getCurrentUser, isUserLoggedIn, AUTH_STATE_CHANGED } from "../utils/Auth";
import UserAvatar from './UserAvatar';

const Header: React.FC<{}> = ({}) => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    useEffect(() => {
        const checkAuthStatus = () => {
            const user = getCurrentUser();
            const loggedIn = isUserLoggedIn();
            setCurrentUser(user);
            setIsLoggedIn(loggedIn);
        };

        // Check auth status on component mount
        checkAuthStatus();
        
        // Listen for custom auth state change events
        window.addEventListener(AUTH_STATE_CHANGED, checkAuthStatus);
        
        // Also listen for storage changes (when user logs in/out in another tab)
        window.addEventListener('storage', checkAuthStatus);
        
        return () => {
            window.removeEventListener(AUTH_STATE_CHANGED, checkAuthStatus);
            window.removeEventListener('storage', checkAuthStatus);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        setIsLoggedIn(false);
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header>
            <div className="logo" onClick={() => { window.location.href = '/'; }}>
                <img src={logo} className="logo-img" alt="logo" />
                <div className="logo-text">EchoBox</div>
            </div>
            
            <div className="mobile-menu-button" onClick={toggleMobileMenu}>
                <i className="fa-solid fa-bars fa-lg" style={{ color: "#0A0593" }}></i>
            </div>
            
            <nav className={mobileMenuOpen ? 'mobile-menu-open' : ''}>
                <ul>
                    <li><a href="/home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
                    <li><a href="/send_feedback" onClick={() => setMobileMenuOpen(false)}>Enviar Feedback</a></li>
                    {/* Only show Admin link for EchoBox company users (company ID 1) */}
                    {isLoggedIn && currentUser?.companyId === 1 && (
                        <li><a href="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</a></li>
                    )}
                    {isLoggedIn ? (
                        <>
                            <li className="user-info">
                                <UserAvatar 
                                    pictureUrl={currentUser?.pictureUser} 
                                    email={currentUser?.email} 
                                    size="sm" 
                                />
                                <span className="user-email">{currentUser?.email}</span>
                            </li>
                            <li><button className="logout-button" onClick={handleLogout}>Sair</button></li>
                        </>
                    ) : (
                        <li><button className="login-button" onClick={() => { window.location.href = '/login'; setMobileMenuOpen(false); }}>Entrar</button></li>
                    )}
                </ul>
            </nav>
        </header>
        
    );
}
export default Header;