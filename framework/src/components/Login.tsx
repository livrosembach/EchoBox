import React from "react";

const Login: React.FC<{}> = ({}) => {
    return (
        <div className="container">
            <div className="form-container">
                <div className="title">Bem-vindo de volta!</div>
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" name="password" id="password" />
                    </div>

                    <button type="button" className="btn-login">Entrar</button>
                    <p>Não tem conta? <a href="/register">Cadastre-se</a></p>
                </form>
            </div>
        </div>
    );
};

export default Login;