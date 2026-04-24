import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, isLoading, isError, message } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  return { user, isLoading, isError, message };
};

export const useRole = () => {
  const { user } = useSelector((state) => state.auth);
  
  const isAdmin = user?.role === 'MoSJE-Admin';
  const isStateAdmin = user?.role === 'State-Admin';
  const isAgencyUser = user?.role === 'Agency-User';
  const canManageProjects = isAdmin || isStateAdmin;

  return {
    role: user?.role,
    isAdmin,
    isStateAdmin,
    isAgencyUser,
    canManageProjects,
  };
};
