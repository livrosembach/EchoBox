import React from "react";
import '../css/Home.css';
import FeedbackTicket from './FeedbackTicket'

const Home: React.FC<{}> = ({}) => {
    
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
                        <option value="category1">Categoria 1</option>
                        <option value="category2">Categoria 2</option>
                    </select>

                    <select className="filter-dropdown">
                        <option value="all-status">Todos Status</option>
                        <option value="status1">Status 1</option>
                        <option value="status2">Status 2</option>
                    </select>
                </div>
            </div>

            <div className="feedback-container">
                <FeedbackTicket />
                <FeedbackTicket />
            </div>
        </div>
    );
};

export default Home;