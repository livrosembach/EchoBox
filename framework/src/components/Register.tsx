import React from "react";

const Register: React.FC<{}> = ({}) => {
    return (
        <div className="container">
            <div className="form-container">
                <div className="title">Junte-se a nós! Cadastre-se agora.</div>
                <form>
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
                    <p>Já tem conta? <a href="/login">Entrar</a></p>
                </form>
            </div>
        </div>
    );
};

export default Register;