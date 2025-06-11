export interface FeedbackDetailData {
    idfeedback: number;
    titlefeedback: string;
    reviewfeedback: string;
    fk_feedback_iduser: number;
    fk_feedback_idcompany: number;
    fk_feedback_idcategory: number;
    fk_feedback_idstatus: number;
    emailuser?: string;
    namecompany?: string;
    typecategory?: string;
    colorcategory?: string;
    typestatus?: string;
    colorstatus?: string;
}
