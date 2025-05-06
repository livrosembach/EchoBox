import React from "react";
import '../css/Login.css';

const Register: React.FC<{}> = ({}) => {
    return (
        <div className="container">
            <div className="form-container">
                <div className="title">Junte-se a nós! Cadastre-se agora.</div>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="username" name="username" id="username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" name="password" id="password" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirme a senha</label>
                        <input type="confirmPassword" name="confirmPassword" id="confirmPassword" />
                    </div>
                    
                    <button type="button" className="btn-login">Cadastre-se</button>
                    <div className="links">
                        <p>Já tem conta? <a href="/login">Entrar</a></p>
                        <p>É uma empresa? <a href="/register_company">Cadastre ela aqui!</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;