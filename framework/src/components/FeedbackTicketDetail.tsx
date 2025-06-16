import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FeedbackDetailData } from "../interface/feedback/FeedbackDetailData";
import { StatusData } from "../interface/feedback/StatusData";
import { getFeedbackDetail } from "../controller/feedback/FeedbackTicketDetail";
import { createReply } from "../controller/feedback/Reply";
import { updateFeedbackStatus } from "../controller/feedback/Feedback";
import { getStatus } from "../controller/feedback/Status";
import { getCurrentUser } from "../utils/Auth";
import UserAvatar from "./UserAvatar";
import '../css/FeedbackTicketDetail.css';
import Swal from 'sweetalert2';

const FeedbackTicketDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [feedback, setFeedback] = useState<FeedbackDetailData | null>(null);
    const [statuses, setStatuses] = useState<StatusData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
    const [showStatusChange, setShowStatusChange] = useState<boolean>(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
    const [replyTitle, setReplyTitle] = useState<string>('');
    const [replyContent, setReplyContent] = useState<string>('');
    const [submittingReply, setSubmittingReply] = useState<boolean>(false);
    
    // Validation errors
    const [validationErrors, setValidationErrors] = useState({
        replyTitle: '',
        replyContent: '',
        selectedStatus: ''
    });

    useEffect(() => {
        const fetchFeedbackDetail = async () => {
            if (!id) {
                setError("ID do feedback não fornecido");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await getFeedbackDetail(id);
                
                if (data) {
                    setFeedback(data);
                    setSelectedStatus(data.fk_feedback_idstatus?.toString() || '');
                    setError(null);
                } else {
                    setError("Falha ao carregar detalhes do feedback");
                }
            } catch (error) {
                console.error("Error fetching feedback details:", error);
                setError("Falha ao carregar detalhes do feedback");
            } finally {
                setLoading(false);
            }
        };

        const fetchStatusOptions = async () => {
            try {
                const statusList = await getStatus();
                setStatuses(statusList);
            } catch (error) {
                console.error("Error fetching status options:", error);
            }
        };

        fetchFeedbackDetail();
        fetchStatusOptions();
    }, [id]);

    // Validate a single field
    const validateField = (name: string, value: string): string => {
        switch (name) {
            case 'replyTitle':
                return !value.trim() ? 'O título da resposta é obrigatório' : '';
            case 'replyContent':
                return !value.trim() 
                    ? 'O conteúdo da resposta é obrigatório' 
                    : value.length < 5 
                        ? 'A resposta deve ter pelo menos 5 caracteres' 
                        : '';
            case 'selectedStatus':
                return !value ? 'Selecione um status' : '';
            default:
                return '';
        }
    };

    const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        
        // Map HTML id to state field name
        const fieldName = id === 'replyTitle' ? 'replyTitle' : 'replyContent';
        
        // Update state based on field
        if (fieldName === 'replyTitle') {
            setReplyTitle(value);
        } else {
            setReplyContent(value);
        }
        
        // Validate and update error
        const fieldError = validateField(fieldName, value);
        setValidationErrors(prev => ({
            ...prev,
            [fieldName]: fieldError
        }));
    };

    // Validate reply form
    const validateReplyForm = (): boolean => {
        const titleError = validateField('replyTitle', replyTitle);
        const contentError = validateField('replyContent', replyContent);
        
        setValidationErrors(prev => ({
            ...prev,
            replyTitle: titleError,
            replyContent: contentError
        }));
        
        return !(titleError || contentError);
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateReplyForm()) {
            Swal.fire({
                title: 'Formulário Incompleto',
                text: 'Por favor, preencha todos os campos corretamente.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser) {
            Swal.fire({
                title: 'Autenticação Necessária',
                text: 'Você deve estar logado para responder.',
                icon: 'info',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
            return;
        }

        if (!feedback) return;

        setSubmittingReply(true);

        try {
            const replyData = {
                titleReply: replyTitle,
                reviewReply: replyContent,
                fk_reply_idFeedback: feedback.idfeedback,
                fk_reply_idUser: parseInt(currentUser.id)
            };

            const newReply = await createReply(replyData);
            
            if (newReply) {
                // Refresh the feedback data to show the new reply
                const updatedFeedback = await getFeedbackDetail(id!);
                if (updatedFeedback) {
                    setFeedback(updatedFeedback);
                }
                
                // Reset form
                setReplyTitle('');
                setReplyContent('');
                setShowReplyForm(false);
                setError(null);
                
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Resposta enviada com sucesso!',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: 'Falha ao enviar resposta. Tente novamente.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#1575C5'
                });
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
            Swal.fire({
                title: 'Erro',
                text: 'Falha ao enviar resposta. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedStatus(value);
        
        // Validate and update error
        const fieldError = validateField('selectedStatus', value);
        setValidationErrors(prev => ({
            ...prev,
            selectedStatus: fieldError
        }));
    };

    // Validate status form
    const validateStatusForm = (): boolean => {
        const statusError = validateField('selectedStatus', selectedStatus);
        
        setValidationErrors(prev => ({
            ...prev,
            selectedStatus: statusError
        }));
        
        return !statusError;
    };

    const handleStatusChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStatusForm()) {
            Swal.fire({
                title: 'Seleção Necessária',
                text: 'Por favor, selecione um status.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
            return;
        }

        setUpdatingStatus(true);

        try {
            const success = await updateFeedbackStatus(feedback!.idfeedback, parseInt(selectedStatus));
            
            if (success) {
                // Refresh the feedback data to show the updated status
                const updatedFeedback = await getFeedbackDetail(id!);
                if (updatedFeedback) {
                    setFeedback(updatedFeedback);
                    setSelectedStatus(updatedFeedback.fk_feedback_idstatus?.toString() || '');
                }
                setShowStatusChange(false);
                setError(null);
                
                Swal.fire({
                    title: 'Sucesso!',
                    text: 'Status atualizado com sucesso!',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: 'Falha ao atualizar status. Tente novamente.',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#1575C5'
                });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            Swal.fire({
                title: 'Erro',
                text: 'Falha ao atualizar status. Tente novamente.',
                icon: 'error',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#1575C5'
            });
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!feedback) return <div className="error">Feedback não encontrado</div>;

    // Determine if current user can reply
    const currentUser = getCurrentUser();
    const canReply = currentUser && (
        // User can reply to their own feedback
        parseInt(currentUser.id) === feedback.fk_feedback_iduser ||
        // Company users can reply to feedback about their company
        (currentUser.companyId && currentUser.companyId === feedback.fk_feedback_idcompany)
    );

    // Determine if current user can change status
    const canChangeStatus = currentUser && (
        // User who created the feedback
        parseInt(currentUser.id) === feedback.fk_feedback_iduser ||
        // User who works at the company the feedback is about
        (currentUser.companyId && currentUser.companyId === feedback.fk_feedback_idcompany) ||
        // EchoBox admin (company ID = 1)
        (currentUser.companyId && currentUser.companyId === 1)
    );

    return (
        <div className="feedback-detail-container">
            <div className="feedback-data">
                <div className="feedback-header">
                    <UserAvatar 
                        pictureUrl={feedback.pictureuser} 
                        email={feedback.emailuser} 
                        size="lg" 
                    />
                    <span>{feedback.emailuser || "Nome de usuário"}</span>
                </div>
                <div className="title">
                    <div className="title-text">
                        <p>{feedback.titlefeedback}</p>
                    </div>
                    <div className="category-status">
                        <span className="tag" style={{ backgroundColor: feedback.colorcategory || '#CCCCCC' }}>{feedback.typecategory}</span>
                        <span className="tag" style={{ backgroundColor: feedback.colorstatus || '#007bff' }}>{feedback.typestatus}</span>
                        {canChangeStatus && (
                            <button 
                                className="change-status-btn"
                                onClick={() => setShowStatusChange(true)}
                                title="Alterar Status"
                            >
                                <i className="fa-solid fa-edit"></i>
                            </button>
                        )}
                    </div>
                </div>
                <div className="description">
                    {feedback.reviewfeedback}
                </div>
            </div>
            <div id="company-answer" className="feedback-data company-answer">
                <div className="feedback-header">
                    <i className="fa-solid fa-building fa-lg"></i>
                    <span>{feedback.namecompany || "Empresa"}</span>
                </div>
                <div className="replies-section">
                    {feedback.replies && feedback.replies.length > 0 ? (
                        feedback.replies.map((reply) => (
                            <div key={reply.idreply} className="reply-item">
                                <div className="reply-header">
                                    <div className="reply-author">
                                        <UserAvatar 
                                            pictureUrl={reply.pictureuser} 
                                            email={reply.emailuser} 
                                            size="sm" 
                                        />
                                        <span>{reply.emailuser || reply.namecompany || "Desconhecido"}</span>
                                    </div>
                                    <h4 className="reply-title">{reply.titlereply}</h4>
                                </div>
                                <div className="reply-content">
                                    {reply.reviewreply}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-replies">
                            <p>Ainda não há resposta da empresa.</p>
                        </div>
                    )}
                </div>
                
                {/* Status Change Form - Only show if user can change status */}
                {showStatusChange && canChangeStatus && (
                    <div className="status-change-modal">
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h3>Alterar Status</h3>
                                    <button 
                                        className="close-button"
                                        onClick={() => setShowStatusChange(false)}
                                    >
                                        <i className="fa-solid fa-times"></i>
                                    </button>
                                </div>
                                
                                <form onSubmit={handleStatusChange} className="status-form">
                                    <div className="form-group">
                                        <label htmlFor="statusSelect">Selecione o Novo Status:</label>
                                        <select
                                            id="statusSelect"
                                            value={selectedStatus}
                                            onChange={handleStatusSelect}
                                            className={validationErrors.selectedStatus ? 'input-error' : ''}
                                        >
                                            <option value="">-- Selecione um Status --</option>
                                            {statuses.map(status => (
                                                <option key={status.idstatus} value={status.idstatus}>
                                                    {status.typestatus}
                                                </option>
                                            ))}
                                        </select>
                                        {validationErrors.selectedStatus && (
                                            <div className="validation-error">{validationErrors.selectedStatus}</div>
                                        )}
                                    </div>
                                    
                                    <div className="form-buttons">
                                        <button
                                            type="button"
                                            onClick={() => setShowStatusChange(false)}
                                            className="cancel-btn"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={updatingStatus}
                                            className="submit-btn"
                                        >
                                            {updatingStatus ? 'Atualizando...' : 'Atualizar Status'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Reply Form - Only show if user can reply */}
                {canReply && (
                    <div className="reply-form-section">
                        {!showReplyForm ? (
                            <button 
                                className="add-reply-btn"
                                onClick={() => setShowReplyForm(true)}
                            >
                                Adicionar Resposta
                            </button>
                        ) : (
                            <form onSubmit={handleReplySubmit} className="reply-form">
                                <h3>Adicionar uma Resposta</h3>
                                <div className="form-group">
                                    <label htmlFor="replyTitle">Título da Resposta:</label>
                                    <input
                                        type="text"
                                        id="replyTitle"
                                        value={replyTitle}
                                        onChange={handleReplyChange}
                                        placeholder="Digite o título da resposta..."
                                        className={validationErrors.replyTitle ? 'input-error' : ''}
                                    />
                                    {validationErrors.replyTitle && (
                                        <div className="validation-error">{validationErrors.replyTitle}</div>
                                    )}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="replyContent">Conteúdo da Resposta:</label>
                                    <textarea
                                        id="replyContent"
                                        value={replyContent}
                                        onChange={handleReplyChange}
                                        placeholder="Digite sua resposta..."
                                        rows={4}
                                        className={validationErrors.replyContent ? 'input-error' : ''}
                                    />
                                    {validationErrors.replyContent && (
                                        <div className="validation-error">{validationErrors.replyContent}</div>
                                    )}
                                </div>
                                <div className="form-buttons">
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setShowReplyForm(false);
                                            setReplyTitle('');
                                            setReplyContent('');
                                            setValidationErrors(prev => ({
                                                ...prev,
                                                replyTitle: '',
                                                replyContent: ''
                                            }));
                                        }}
                                        className="cancel-btn"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={submittingReply}
                                        className="submit-btn"
                                    >
                                        {submittingReply ? 'Enviando...' : 'Enviar Resposta'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackTicketDetail;