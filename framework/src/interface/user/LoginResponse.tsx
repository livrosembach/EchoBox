export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        companyId?: string;
        pictureUser?: string;
    };
}