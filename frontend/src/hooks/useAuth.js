import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { initSocket, disconnectSocket } from '../services/socket';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, logout: clearAuth, hasRole } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials),
    onSuccess: ({ data }) => {
      setAuth(data.data);
      initSocket();
      toast.success(`Welcome back, ${data.data.user.name}!`);
      navigate('/dashboard');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Login failed'),
  });

  const registerMutation = useMutation({
    mutationFn: (formData) => api.post('/auth/register', formData),
    onSuccess: () => {
      toast.success('Account created! Please log in.');
      navigate('/login');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Registration failed'),
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSettled: () => {
      clearAuth();
      disconnectSocket();
      queryClient.clear();
      navigate('/login');
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data) => api.patch('/auth/change-password', data),
    onSuccess: () => toast.success('Password changed successfully'),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to change password'),
  });

  return {
    user,
    isAuthenticated,
    hasRole,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
