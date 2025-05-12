import React from "react";
import { FeedbackData } from "../interface/feedback/FeedbackData";
import '../css/FeedbackTicketDetail.css'


const FeedbackTicket: React.FC<{}> = ({}) => {   

    return (
        <div className="feedback-detail-container">
            <div className="feedback-data">
                <div className="feedback-header">
                    <i className="fa-solid fa-circle-user fa-lg"></i>
                    <span>Username</span>
                </div>
                <div className="title">
                    <div className="title-text">
                        <p>Titulo</p>
                    </div>
                    <div className="category-status">
                        <span className="tag entertainment">educação</span>
                        <span className="tag answered">respondida</span>
                    </div>
                </div>
                <div className="description">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, eum aut laborum, maiores deserunt odio voluptate numquam, alias voluptatum quaerat illum autem quo in ipsam. Tenetur, harum! Ad, soluta accusantium. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore eum ducimus neque veritatis impedit. Aliquam magnam, obcaecati cupiditate a exercitationem animi alias deleniti atque voluptatem ut. Quasi dolores alias repellendus. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus id obcaecati repellat quidem recusandae iste, dolorem consectetur omnis. Eligendi, ipsa minima. Aperiam itaque qui soluta dignissimos pariatur asperiores velit repellat?
                </div>
            </div>
            <div id="company-answer" className="feedback-data company-answer">
                    <div className="feedback-header">
                        <i className="fa-solid fa-circle-user fa-lg"></i>
                        <span>Empresa</span>
                    </div>
                    <div className="description">
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsum, alias? Debitis quo repellat recusandae aspernatur qui cupiditate unde corrupti odio maxime. Provident quibusdam aut dolor accusamus? Voluptatem unde deleniti tempore.
                    </div>
            </div>
        </div>
    );
};

export default FeedbackTicket;