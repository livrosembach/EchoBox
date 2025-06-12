import React, {useState} from "react";
import { useNavigate } from "react-router-dom"; 
import { loginUser } from "../controller/user/Login";
import '../css/Login.css';

const Login: React.FC<{}> = ({}) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userData = {
            emailUser: formData.email,
            passwordUser: formData.password,
        };

        const result = await loginUser(userData);

        if (result) {
            alert("Usuário logado com sucesso!");
            setFormData({
                email: "",
                password: "",
            });

            navigate("/home");
        } else {
            alert("Falha no login.");
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div className="title">Bem-vindo de volta!</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn-login">Entrar</button>
                    <p>Não tem conta? <a href="/register">Cadastre-se</a></p>
                </form>
            </div>
        </div>
    );
};

export default Login;