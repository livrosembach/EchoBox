import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from './Auth';

export const isEchoBoxAdmin = (): boolean => {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.companyId === 1;
};

export const useAdminGuard = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        
        if (!currentUser || currentUser.companyId !== 1) {
            alert('Acesso negado. Apenas administradores do EchoBox podem acessar esta página.');
            navigate('/home');
            setIsAuthorized(false);
        } else {
            setIsAuthorized(true);
        }
        
        setIsLoading(false);
    }, [navigate]);

    return { isAuthorized, isLoading };
};
