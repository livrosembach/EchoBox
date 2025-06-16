import React, {useEffect, useState} from "react";
import { FeedbackData } from "../../interface/feedback/FeedbackData";
import FeedbackTicket from "../../components/FeedbackTicket";
import { FeedbackListProps } from "../../interface/feedback/FeedbackListProps";
import { getFeedbacks } from "./Feedback";


const FeedbackList: React.FC<FeedbackListProps> = ({ searchTerm, selectedCategory, selectedStatus, selectedCompany }) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                setLoading(true);
                const data = await getFeedbacks({
                    search: searchTerm,
                    category: selectedCategory,
                    status: selectedStatus,
                    company: selectedCompany
                });
                setFeedbacks(data);
                setError(null);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
                setError("Erro ao carregar feedbacks. Tente novamente.");
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, [searchTerm, selectedCategory, selectedStatus, selectedCompany]);

    return (
        <div className="feedback-list">
            {loading ? (
                <div className="loading-feedbacks">
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <p>Carregando feedbacks...</p>
                </div>
            ) : error ? (
                <div className="feedback-error">
                    <i className="fa-solid fa-exclamation-circle"></i>
                    <p>{error}</p>
                </div>
            ) : feedbacks.length > 0 ? (
                feedbacks.map((fb) => (
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
                ))
            ) : (
                <div className="no-results">
                    <i className="fa-solid fa-search"></i>
                    <p>Nenhum feedback encontrado com os filtros aplicados.</p>
                </div>
            )}
        </div>
    );
};

export default FeedbackList;