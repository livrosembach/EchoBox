import React, { useEffect, useState } from "react";
import {ReactComponent as Star} from "../assets/star.svg"
import '../css/SendFeedbacks.css';
import CategorySelect from "../components/CategorySelect";
import { CategoryData } from "../interface/feedback/CategoryData";
import { getCategories } from "../controller/feedback/Category";
import CompanySelect from "./CompanySelect";
import { CompanyData } from "../interface/register/CompanyData";
import { getCompanies } from "../controller/feedback/Company";

const SendFeedback: React.FC<{}> = ({}) => {
    const [categories, setCategories] = useState<CategoryData[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const cat = await getCategories();
            setCategories(cat);
        };

        fetchCategories();
    }, []);

    const [companies, setCompanies] = useState<CompanyData[]>([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            const comp = await getCompanies();
            setCompanies(comp);
        };

        fetchCompanies();
    }, []);
    
    return (
        <div className="send-container">
            <div className="form-container">
            <div className="title">Feedback</div>
                <form action="">
                    <div className="form-group-feedback">
                        <label htmlFor="chose">Título</label>
                        <input type="text" />
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="chose">Empresa</label>
                        <CompanySelect companies={companies} />
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="category">Categoria</label>
                        <CategorySelect categories={categories} />
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="stars-group">Avaliação</label>
                        <div className="stars-group">
                            <Star className="star" />
                            <Star className="star" />
                            <Star className="star" />
                            <Star className="star" />
                            <Star className="star" />
                        </div>
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="comments">Comentários</label>
                        <textarea name="comments" id="comments"></textarea>
                    </div>
                    <button className="btn-feedback">Enviar</button>
                </form>
            </div>
        </div>
    );
};

export default SendFeedback;