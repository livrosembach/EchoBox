import React, {useEffect, useState} from "react";
import { FeedbackData } from "../../interface/feedback/FeedbackData";
import FeedbackTicket from "../../components/FeedbackTicket";


const FeedbackList: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch("http://localhost:3003/feedback");
                const data = await response.json();
                setFeedbacks(data);
            } catch (error) {
                console.error("Erro ao buscar feedbacks:", error);
            }
        };

        fetchFeedbacks();
    }, []);

    return (
        <div>
            {feedbacks.map((fb) => (
                <FeedbackTicket
                    key={fb.idfeedback}
                    idfeedback={fb.idfeedback}
                    titlefeedback={fb.titlefeedback}
                    reviewfeedback={fb.reviewfeedback}
                    ratingfeedback={Number(fb.ratingfeedback)}
                    typecategory={fb.typecategory}
                    typestatus={fb.typestatus}
                />
            ))}
        </div>
    );
};

export default FeedbackList;