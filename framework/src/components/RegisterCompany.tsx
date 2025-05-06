import React from "react";
import '../css/Login.css';

const RegisterCompany: React.FC<{}> = ({}) => {
    return (
        <div className="container">
            <div className="form-container">
                <div className="title">Cadastre sua empresa agora!</div>
                <form>
                    <div className="form-group">
                        <label htmlFor="nameCompany">Nome da empresa</label>
                        <input type="nameCompany" name="nameCompany" id="nameCompany" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cnpj">CNPJ</label>
                        <input type="cnpj" name="cnpj" id="cnpj" />
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
                        <p>É um cliente? <a href="/register">Cadastre-se</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterCompany;