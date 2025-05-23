import React from "react";
import logo from '../assets/logo.svg';
import '../css/Header.css';

const Header: React.FC<{}> = ({}) => {
        return (
            <header>
            <div className="logo" onClick={() => { window.location.href = '/'; }}>
                <img src={logo} className="logo-img" alt="logo" />
                <div className="logo-text">EchoBox</div>
            </div>
            <nav>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/send_feedback">Enviar Feedback</a></li>
                    <li><button className="login-button" onClick={() => { window.location.href = '/login'; }}>Login</button></li>
                </ul>
            </nav>
        </header>
        
    );
}
export default Header;