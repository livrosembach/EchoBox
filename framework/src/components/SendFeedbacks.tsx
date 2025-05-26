import React, { useEffect, useState } from "react";
import '../css/SendFeedbacks.css';
import { CategoryData } from "../interface/feedback/CategoryData";
import { getCategory } from "../controller/feedback/Category";
import { CompanyData } from "../interface/register/CompanyData";
import { getCompanies } from "../controller/feedback/Company";
import { SendFeedbackData } from "../interface/feedback/SendFeedbackData";

const SendFeedback: React.FC<{}> = ({}) => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [companies, setCompanies] = useState<CompanyData[]>([]);
    
    // Form state
    const [title, setTitle] = useState<string>('');
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [comments, setComments] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    useEffect(() => {
        const fetchCategories = async () => {
            const cat = await getCategory();
            setCategories(cat);
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchCompanies = async () => {
            const comp = await getCompanies();
            setCompanies(comp);
        };

        fetchCompanies();
    }, []);

 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !selectedCompany || !selectedCategory || !comments) {
            alert('Todos os campos são obrigatórios!');
            return;
        }

        setIsSubmitting(true);
        
        try {
            const feedbackData: SendFeedbackData = {
                titleFeedback: title,
                reviewFeedback: comments,
                fk_feedback_idUser: 1, 
                fk_feedback_idCompany: parseInt(selectedCompany),
                fk_feedback_idCategory: parseInt(selectedCategory),
                fk_feedback_idStatus: 1 // Default status
            };

            const result = await fetch("http://localhost:3003/send_feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(feedbackData),
            });

            if (result.ok) {
                alert('Feedback enviado com sucesso!');
                // Reset form
                setTitle('');
                setSelectedCompany('');
                setSelectedCategory('');
                setComments('');
            } else {
                alert('Erro ao enviar feedback. Tente novamente.');
            }
        } catch (error) {
            console.error('Error sending feedback:', error);
            alert('Erro ao enviar feedback. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <div className="send-container">
            <div className="form-container">
                <div className="title">Feedback</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-feedback">
                        <label htmlFor="title">Título</label>
                        <input 
                            type="text" 
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="company">Empresa</label>
                        <select 
                            name="company" 
                            id="company"
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
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
                            onChange={(e) => setSelectedCategory(e.target.value)}
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
                            onChange={(e) => setComments(e.target.value)}
                            required
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
        </div>
    );
};

export default SendFeedback;