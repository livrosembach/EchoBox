import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { registerUser } from "../controller/register/Register";
import "../css/Login.css";

const Register: React.FC<{}> = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const userData = {
            emailUser: formData.email,
            passwordUser: formData.password,
        };

        const result = await registerUser(userData);

        if (result) {
            alert("User registered successfully!");
            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
            });

            navigate("/Login")
        } else {
            alert("Failed to register user.");
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div className="title">Junte-se a nós! Cadastre-se agora.</div>
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
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirme a senha</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn-login">Cadastre-se</button>
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