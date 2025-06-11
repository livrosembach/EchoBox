import React, {useEffect, useState} from "react";
import { FeedbackData } from "../../interface/feedback/FeedbackData";
import FeedbackTicket from "../../components/FeedbackTicket";
import { FeedbackListProps } from "../../interface/feedback/FeedbackListProps";
import { getFeedbacks } from "./Feedback";


const FeedbackList: React.FC<FeedbackListProps> = ({ searchTerm, selectedCategory, selectedStatus, selectedCompany }) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const data = await getFeedbacks({
                    search: searchTerm,
                    category: selectedCategory,
                    status: selectedStatus,
                    company: selectedCompany
                });
                setFeedbacks(data);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        };

        fetchFeedbacks();
    }, [searchTerm, selectedCategory, selectedStatus, selectedCompany]);

    return (
        <div>
            {feedbacks.map((fb) => (
                <FeedbackTicket
                    key={fb.idfeedback}
                    idfeedback={fb.idfeedback}
                    titlefeedback={fb.titlefeedback}
                    reviewfeedback={fb.reviewfeedback}
                    typecategory={fb.typecategory}
                    colorcategory={fb.colorcategory}
                    typestatus={fb.typestatus}
                    colorstatus={fb.colorstatus}
                />
            ))}
        </div>
    );
};

export default FeedbackList;