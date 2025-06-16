import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/Login.css';
import Swal from 'sweetalert2';

const RegisterCompany: React.FC<{}> = ({}) => {
    const [formData, setFormData] = useState({
        nameCompany: "",
        cnpj: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [validationErrors, setValidationErrors] = useState({
        nameCompany: "",
        cnpj: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Password visibility state
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    // Password strength state
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0, // 0-4 scale
        hasLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecial: false
    });
    
    const navigate = useNavigate();

    // Validate a single field
    const validateField = (name: string, value: string, allValues = formData): string => {
        switch (name) {
            case 'nameCompany':
                return !value.trim() ? 'O nome da empresa é obrigatório' : '';
            case 'cnpj':
                if (!value.trim()) return 'O CNPJ é obrigatório';
                // Basic CNPJ format validation (could be enhanced)
                const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;
                return !cnpjRegex.test(value) ? 'CNPJ inválido' : '';
            case 'email':
                if (!value.trim()) return 'O email é obrigatório';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(value) ? 'Digite um email válido' : '';
            case 'password':
                if (!value.trim()) return 'A senha é obrigatória';
                
                // Password must be at least 8 characters
                if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
                
                // Password must contain one uppercase letter
                if (!/[A-Z]/.test(value)) return 'A senha deve conter pelo menos uma letra maiúscula';
                
                // Password must contain one lowercase letter
                if (!/[a-z]/.test(value)) return 'A senha deve conter pelo menos uma letra minúscula';
                
                // Password must contain one number
                if (!/[0-9]/.test(value)) return 'A senha deve conter pelo menos um número';
                
                // Password must contain one special character
                if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) 
                    return 'A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{};\':"\\|,.<>/?)';
                
                return '';
            case 'confirmPassword':
                if (!value.trim()) return 'Confirme sua senha';
                if (value !== allValues.password) return 'As senhas não coincidem';
                return '';
            default:
                return '';
        }
    };
    
    // Check password strength and update criteria state
    const checkPasswordStrength = (password: string) => {
        // Check criteria
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        // Calculate score (0-4)
        let score = 0;
        if (hasLength) score++;
        if (hasUppercase) score++;
        if (hasLowercase) score++;
        if (hasNumber) score++;
        if (hasSpecial) score++;
        
        // Adjust score based on password length
        if (password.length < 4) score = Math.min(score, 1);
        if (password.length < 6) score = Math.min(score, 2);
        
        setPasswordStrength({
            score: Math.min(Math.floor(score * 0.8), 4), // Scale to 0-4
            hasLength,
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSpecial
        });
    };

    // Get password strength label
    const getPasswordStrengthText = () => {
        switch (passwordStrength.score) {
            case 0: return 'Muito fraca';
            case 1: return 'Fraca';
            case 2: return 'Média';
            case 3: return 'Forte';
            case 4: return 'Muito forte';
            default: return '';
        }
    };

    // Get password strength class
    const getPasswordStrengthClass = () => {
        switch (passwordStrength.score) {
            case 0: return 'strength-very-weak';
            case 1: return 'strength-weak';
            case 2: return 'strength-medium';
            case 3: return 'strength-strong';
            case 4: return 'strength-very-strong';
            default: return '';
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        
        // Check password strength when password field changes
        if (name === 'password') {
            checkPasswordStrength(value);
        }
        
        // For confirmPassword, we need to validate it using the updated form data
        const fieldError = validateField(name, value, newFormData);
        setValidationErrors(prev => ({
            ...prev,
            [name]: fieldError
        }));
        
        // If we're updating password, we need to re-validate confirmPassword
        if (name === 'password' && formData.confirmPassword) {
            const confirmError = validateField('confirmPassword', formData.confirmPassword, newFormData);
            setValidationErrors(prev => ({
                ...prev,
                confirmPassword: confirmError
            }));
        }

        // Format CNPJ as user types
        if (name === 'cnpj') {
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length <= 14) {
                let formattedCnpj = '';
                
                if (digitsOnly.length > 2) {
                    formattedCnpj += digitsOnly.substring(0, 2) + '.';
                    if (digitsOnly.length > 5) {
                        formattedCnpj += digitsOnly.substring(2, 5) + '.';
                        if (digitsOnly.length > 8) {
                            formattedCnpj += digitsOnly.substring(5, 8) + '/';
                            if (digitsOnly.length > 12) {
                                formattedCnpj += digitsOnly.substring(8, 12) + '-' + digitsOnly.substring(12, 14);
                            } else {
                                formattedCnpj += digitsOnly.substring(8);
                            }
                        } else {
                            formattedCnpj += digitsOnly.substring(5);
                        }
                    } else {
                        formattedCnpj += digitsOnly.substring(2);
                    }
                } else {
                    formattedCnpj = digitsOnly;
                }
                
                // Only update if formatting changed the value
                if (formattedCnpj !== value) {
                    setFormData(prev => ({
                        ...prev,
                        cnpj: formattedCnpj
                    }));
                }
            }
        }
    };

    // Validate all fields
    const validateForm = (): boolean => {
        const nameError = validateField('nameCompany', formData.nameCompany);
        const cnpjError = validateField('cnpj', formData.cnpj);
        const emailError = validateField('email', formData.email);
        const passwordError = validateField('password', formData.password);
        const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword);
        
        setValidationErrors({
            nameCompany: nameError,
            cnpj: cnpjError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError
        });
        
        return !(nameError || cnpjError || emailError || passwordError || confirmPasswordError);
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

        // API call would go here
        try {
            // Mock successful registration for now
            setTimeout(() => {
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Empresa cadastrada com sucesso! Aguarde aprovação do administrador.',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#1575C5'
                }).then(() => {
                    navigate('/login');
                });
            }, 1500);
        } catch (error) {
            console.error("Registration error:", error);
            Swal.fire({
                title: 'Erro',
                text: 'Falha ao cadastrar empresa. Por favor, tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div className="title title-login">Cadastre sua empresa agora!</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nameCompany">Nome da empresa</label>
                        <input 
                            type="text" 
                            name="nameCompany" 
                            id="nameCompany" 
                            value={formData.nameCompany}
                            onChange={handleChange}
                            className={validationErrors.nameCompany ? 'input-error' : ''}
                        />
                        {validationErrors.nameCompany && <div className="validation-error">{validationErrors.nameCompany}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="cnpj">CNPJ</label>
                        <input 
                            type="text" 
                            name="cnpj" 
                            id="cnpj" 
                            value={formData.cnpj}
                            onChange={handleChange}
                            placeholder="00.000.000/0000-00"
                            className={validationErrors.cnpj ? 'input-error' : ''}
                        />
                        {validationErrors.cnpj && <div className="validation-error">{validationErrors.cnpj}</div>}
                    </div>
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
                        {formData.password && (
                            <div className="password-strength-meter">
                                <div className={`strength-meter-fill ${getPasswordStrengthClass()}`}></div>
                            </div>
                        )}
                        {formData.password && (
                            <div className="password-strength-text">
                                Força da senha: <strong>{getPasswordStrengthText()}</strong>
                            </div>
                        )}
                        <div className="password-criteria">
                            <small>A senha deve conter:</small>
                            <ul>
                                <li className={passwordStrength.hasLength ? 'met' : ''}>
                                    Pelo menos 8 caracteres
                                </li>
                                <li className={passwordStrength.hasUppercase ? 'met' : ''}>
                                    Pelo menos uma letra maiúscula
                                </li>
                                <li className={passwordStrength.hasLowercase ? 'met' : ''}>
                                    Pelo menos uma letra minúscula
                                </li>
                                <li className={passwordStrength.hasNumber ? 'met' : ''}>
                                    Pelo menos um número
                                </li>
                                <li className={passwordStrength.hasSpecial ? 'met' : ''}>
                                    Pelo menos um caractere especial
                                </li>
                            </ul>
                        </div>
                        {validationErrors.password && <div className="validation-error">{validationErrors.password}</div>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirme a senha</label>
                        <div className="password-wrapper">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirmPassword" 
                                id="confirmPassword" 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={validationErrors.confirmPassword ? 'input-error' : ''}
                            />
                            <button 
                                type="button" 
                                className="btn-toggle-password"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                            >
                                {showConfirmPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                            </button>
                        </div>
                        {validationErrors.confirmPassword && <div className="validation-error">{validationErrors.confirmPassword}</div>}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="btn-login"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastre-se'}
                    </button>
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