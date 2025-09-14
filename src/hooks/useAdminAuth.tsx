import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAdminAuth = (redirectTo: string = '/dashboard') => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate(redirectTo);
    }
  }, [user, isAdmin, loading, navigate, redirectTo]);

  return { user, isAdmin, loading, isAuthorized: !loading && user && isAdmin };
};