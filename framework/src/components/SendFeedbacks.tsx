import React from "react";
import {ReactComponent as Star} from "../assets/star.svg"
import '../css/SendFeedbacks.css';

const SendFeedback: React.FC<{}> = ({}) => {
    
    return (
        <div className="send-container">
            <div className="form-container">
            <div className="title">Feedback</div>
                <form action="">
                    <div className="form-group-feedback">
                        <label htmlFor="chose">Escolha para quem é o feedback</label>
                        <select name="chose" id="chose">
                            <option value="1"></option>
                            <option value="2">fulano</option>
                            <option value="3">ciclano</option>
                        </select>
                    </div>
                    <div className="form-group-feedback">
                        <label htmlFor="category">Categoria</label>
                        <select name="category" id="category">
                            <option value="1"></option>
                            <option value="2">Entretenimento</option>
                            <option value="3">Educação</option>
                        </select>
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