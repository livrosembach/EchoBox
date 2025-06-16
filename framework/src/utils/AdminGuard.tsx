import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from './Auth';
import Swal from 'sweetalert2';

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
            // Replace alert with SweetAlert2 notification
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Apenas administradores do EchoBox podem acessar esta página.',
                icon: 'warning',
                confirmButtonText: 'OK',
                confirmButtonColor: '#1575C5',
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                navigate('/home');
            });
            setIsAuthorized(false);
        } else {
            setIsAuthorized(true);
        }
        
        setIsLoading(false);
    }, [navigate]);

    return { isAuthorized, isLoading };
};
