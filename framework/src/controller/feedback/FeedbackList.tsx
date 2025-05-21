import React, {useEffect, useState} from "react";
import { FeedbackData } from "../../interface/feedback/FeedbackData";
import FeedbackTicket from "../../components/FeedbackTicket";
import { FeedbackListProps } from "../../interface/feedback/FeedbackListProps";


const FeedbackList: React.FC<FeedbackListProps> = ({ searchTerm, selectedCategory, selectedStatus }) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (searchTerm) queryParams.append('search', searchTerm);
                if (selectedCategory && selectedCategory !== 'all-categories') queryParams.append('category', selectedCategory);
                if (selectedStatus && selectedStatus !== 'all-status') queryParams.append('status', selectedStatus);

                const response = await fetch(`http://localhost:3003/feedback?${queryParams.toString()}`);
                const data = await response.json();
                setFeedbacks(data);
            } catch (error) {
                console.error("Erro ao buscar feedbacks:", error);
            }
        };

        fetchFeedbacks();
    }, [searchTerm, selectedCategory, selectedStatus]);

    return (
        <div>
            {feedbacks.map((fb) => (
                <FeedbackTicket
                    idfeedback={fb.idfeedback}
                    titlefeedback={fb.titlefeedback}
                    reviewfeedback={fb.reviewfeedback}
                    typecategory={fb.typecategory}
                    typestatus={fb.typestatus}
                />
            ))}
        </div>
    );
};

export default FeedbackList;