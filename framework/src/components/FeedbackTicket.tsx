import React from "react";
import '../css/Home.css';

const FeedbackTicket: React.FC<{}> = ({}) => {
    
    return (
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
    );
};

export default FeedbackTicket;