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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all-categories');
    const [selectedStatus, setSelectedStatus] = useState<string>('all-status');

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

        console.log("Search Term:", searchTerm);
        console.log("Selected Category:", selectedCategory);
        console.log("Selected Status:", selectedStatus);


   return (
        <div className="start-container">
            <div className="bar">
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Buscar feedbacks"
                        className="search-bar"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <span className="search-icon">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>

                <div className="filters">
                    <select
                        className="filter-dropdown"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="all-categories">Todas Categorias</option>
                        {categories.map(category => (
                            <option key={category.idcategory} value={category.idcategory.toString()}>
                                {category.typecategory}
                            </option>
                        ))}
                    </select>

                    <select
                        className="filter-dropdown"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                    >
                        <option value="all-status">Todos Status</option>
                        {statuses.map(status => (
                            <option key={status.idstatus} value={status.idstatus.toString()}>
                                {status.typestatus}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="feedback-container">
                <FeedbackList
                    searchTerm={searchTerm}
                    selectedCategory={selectedCategory}
                    selectedStatus={selectedStatus}
                />
            </div>
        </div>
    );
};

export default Home;