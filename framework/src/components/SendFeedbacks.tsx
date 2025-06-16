import React, { useEffect, useState } from "react";
import '../css/SendFeedbacks.css';
import { CategoryData } from "../interface/feedback/CategoryData";
import { getCategory } from "../controller/feedback/Category";
import { CompanyData } from "../interface/user/CompanyData";
import { getCompanies } from "../controller/feedback/Company";
import { SendFeedbackData } from "../interface/feedback/SendFeedbackData";
import { sendFeedback } from "../controller/feedback/SendFeedback";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/Auth";
import Swal from 'sweetalert2';


const SendFeedback: React.FC<{}> = ({}) => {
    const navigate = useNavigate()
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [companies, setCompanies] = useState<CompanyData[]>([]);
    
    // Form state
    const [title, setTitle] = useState<string>('');
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [formTouched, setFormTouched] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cat = await getCategory();
                setCategories(cat);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Falha ao carregar categorias. Por favor, atualize a página.");
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const comp = await getCompanies();
                setCompanies(comp);
            } catch (err) {
                console.error("Error fetching companies:", err);
                setError("Falha ao carregar empresas. Por favor, atualize a página.");
            }
        };

        fetchCompanies();
    }, []);

    // Clear error when user starts interacting with form
    useEffect(() => {
        if (formTouched && error) {
            setError('');
        }
    }, [title, selectedCompany, selectedCategory, comments, formTouched, error]);
 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!formTouched) setFormTouched(true);
        
        const { name, value } = e.target;
        switch (name) {
            case 'title':
                setTitle(value);
                break;
            case 'company':
                setSelectedCompany(value);
                break;
            case 'category':
                setSelectedCategory(value);
                break;
            case 'comments':
                setComments(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !selectedCompany || !selectedCategory || !comments) {
            Swal.fire({
                title: 'Formulário Incompleto',
                text: 'Todos os campos são obrigatórios!',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
            return;
        }

        // Get the current logged-in user
        const currentUser = getCurrentUser();
        if (!currentUser) {
            Swal.fire({
                title: 'Autenticação Necessária',
                text: 'Você precisa estar logado para enviar feedback!',
                icon: 'info',
                confirmButtonText: 'Ir para Login',
                confirmButtonColor: '#1575C5'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }        
        
        setIsSubmitting(true);
        setError('');
        
        try {
            const feedbackData: SendFeedbackData = {
                titleFeedback: title,
                reviewFeedback: comments,
                fk_feedback_idUser: parseInt(currentUser.id), 
                fk_feedback_idCompany: parseInt(selectedCompany),
                fk_feedback_idCategory: parseInt(selectedCategory),
                fk_feedback_idStatus: 1 // Default value
            };

            const success = await sendFeedback(feedbackData);

            if (success) {
                // Show success message with SweetAlert
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Feedback enviado com sucesso!',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/home');
                });
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: 'Erro ao enviar feedback. Tente novamente.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#1575C5'
                });
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            Swal.fire({
                title: 'Erro',
                text: 'Erro ao enviar feedback. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="send-container">
            <div className="form-container">
                <div className="title">Feedback</div>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="responsive-form">
                    <div className="form-group-feedback">
                        <label htmlFor="title">Título</label>
                        <input 
                            type="text" 
                            id="title"
                            name="title"
                            value={title}
                            onChange={handleInputChange}
                            required
                            placeholder="Digite um título para o feedback"
                        />
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="company">Empresa</label>
                        <select 
                            name="company" 
                            id="company"
                            value={selectedCompany}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione uma empresa</option>
                            {companies.map((company) => (
                                <option key={company.idcompany} value={company.idcompany}>
                                    {company.namecompany}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="category">Categoria</label>
                        <select 
                            name="category" 
                            id="category"
                            value={selectedCategory}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            {categories.map((category) => (
                                <option key={category.idcategory} value={category.idcategory}>
                                    {category.typecategory}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="comments">Comentários</label>
                        <textarea 
                            name="comments" 
                            id="comments"
                            value={comments}
                            onChange={handleInputChange}
                            required
                            placeholder="Descreva seu feedback detalhadamente..."
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="btn-feedback"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </button>
                </form>
            </div>
            {isSubmitting && (
                <div className="submit-overlay">
                    <div className="spinner"></div>
                    <p>Enviando seu feedback...</p>
                </div>
            )}
            {showSuccess && (
                <div className="success-overlay">
                    <div className="success-icon">✓</div>
                    <p>Feedback enviado com sucesso!</p>
                    <p className="redirect-text">Redirecionando para a página inicial...</p>
                </div>
            )}
        </div>
    );
};

export default SendFeedback;