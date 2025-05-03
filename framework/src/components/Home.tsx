import React from "react";
import '../css/Home.css';

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
                <div className="feedback">
                    <h2 className="feedback-title"><i className="fa-solid fa-envelope"></i> Titulo</h2>
                    <div className="feedback-tags">
                        <span className="tag entertainment">Entretenimento</span>
                        <span className="tag answered">Respondida</span>
                    </div>
                    <p className="feedback-description">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam, voluptate! Sunt iste sed maiores nam voluptate eos id nisi ad impedit? O Lucas é lindo? Corrupti doloremque itaque obcaecati! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Recusandae sequi temporibus maiores perspiciatis incidunt esse nemo hic doloremque consequatur doloribus, impedit corporis deleniti sapiente accusantium neque cumque distinctio cupiditate obcaecati!
                    </p>
                </div>

                <div className="feedback">
                    <h2 className="feedback-title"><i className="fa-solid fa-envelope"></i> Titulo</h2>
                    <div className="feedback-tags">
                        <span className="tag education">Educação</span>
                        <span className="tag answered">Respondida</span>
                    </div>
                    <p className="feedback-description">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam, voluptate! Sunt iste sed maiores nam voluptate eos id nisi ad impedit? Illo at libero nostrum vero? Corrupti doloremque itaque obcaecati! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic eligendi necessitatibus est. Voluptas alias consectetur suscipit molestias, dignissimos, omnis sint dolorum adipisci in, accusamus labore necessitatibus esse ipsam. Ratione, voluptates?
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;