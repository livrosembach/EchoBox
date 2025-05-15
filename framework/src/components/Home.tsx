import React, { useEffect, useState } from 'react';
import '../css/Home.css';
import FeedbackList from "../controller/feedback/FeedbackList";
import { getCategory } from '../controller/feedback/Category';
import { getStatus } from '../controller/feedback/Status';
import { CategoryData } from '../interface/feedback/CategoryData';
import { StatusData } from '../interface/feedback/StatusData';

const Home: React.FC<{}> = ({}) => {
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [statuses, setStatuses] = useState<StatusData[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategory();
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        const fetchStatuses = async () => {
            try {
                const data = await getStatus();
                setStatuses(data);
            } catch (error) {
                console.error("Error fetching statuses:", error);
            }
        };

        fetchCategories();
        fetchStatuses();
    }, []);

    return (
        <div className="start-container">
            <div className="bar">
                <div className="search-bar-container">
                    <input type="text" placeholder="Buscar feedbacks" className="search-bar" />
                    <span className="search-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>

                <div className="filters">
                    <select className="filter-dropdown">
                        <option value="all-categories">Todas Categorias</option>
                        {categories.map(category => (
                            <option key={category.idcategory} value={category.idcategory}>
                                {category.typecategory}
                            </option>
                        ))}
                    </select>

                    <select className="filter-dropdown">
                        <option value="all-status">Todos Status</option>
                        {statuses.map(status => (
                            <option key={status.idstatus} value={status.idstatus}>
                                {status.typestatus}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="feedback-container">
                <FeedbackList />
            </div>
        </div>
    );
};

export default Home;