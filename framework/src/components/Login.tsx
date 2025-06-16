import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom"; 
import { loginUser } from "../controller/user/Login";
import { isUserLoggedIn } from "../utils/Auth";
import '../css/Login.css';
import Swal from 'sweetalert2';

const Login: React.FC<{}> = ({}) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [validationErrors, setValidationErrors] = useState({
        email: "",
        password: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    
    // Check if user is already logged in
    useEffect(() => {
        if (isUserLoggedIn()) {
            Swal.fire({
                title: 'Você já está logado',
                text: 'Redirecionando para a página inicial',
                icon: 'info',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            }).then(() => {
                navigate('/home');
            });
        }
    }, [navigate]);

    // Validate a single field
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'email':
                if (!value.trim()) return 'O email é obrigatório';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(value) ? 'Digite um email válido' : '';
            case 'password':
                return !value.trim() ? 'A senha é obrigatória' : '';
            default:
                return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // Validate the field and update errors
        const fieldError = validateField(name, value);
        setValidationErrors(prev => ({
            ...prev,
            [name]: fieldError
        }));
    };

    // Validate all fields
    const validateForm = (): boolean => {
        const emailError = validateField('email', formData.email);
        const passwordError = validateField('password', formData.password);
        
        setValidationErrors({
            email: emailError,
            password: passwordError
        });
        
        return !(emailError || passwordError);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields before submission
        if (!validateForm()) {
            Swal.fire({
                title: 'Formulário Incompleto',
                text: 'Por favor, corrija os erros no formulário antes de enviar.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
            return;
        }

        setIsSubmitting(true);

        const userData = {
            emailUser: formData.email,
            passwordUser: formData.password,
        };

        try {
            const result = await loginUser(userData);

            if (result) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Usuário logado com sucesso!',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    setFormData({
                        email: "",
                        password: "",
                    });
                    navigate("/home");
                });
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: 'Email ou senha incorretos. Por favor, tente novamente.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#1575C5',
                    footer: '<a href="/forgot-password">Esqueceu sua senha?</a>'
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            Swal.fire({
                title: 'Erro',
                text: 'Ocorreu um erro durante o login. Por favor, tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div className="title title-login">Bem-vindo de volta!</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={validationErrors.email ? 'input-error' : ''}
                        />
                        {validationErrors.email && <div className="validation-error">{validationErrors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Senha</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={validationErrors.password ? 'input-error' : ''}
                            />
                            <button
                                type="button"
                                className="btn-toggle-password"
                                onClick={() => setShowPassword(prev => !prev)}
                                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                            </button>
                        </div>
                        {validationErrors.password && <div className="validation-error">{validationErrors.password}</div>}
                    </div>

                    <button 
                        type="submit" 
                        className="btn-login"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </button>
                    <p>Não tem conta? <a href="/register">Cadastre-se</a></p>
                </form>
            </div>
        </div>
    );
};

export default Login;